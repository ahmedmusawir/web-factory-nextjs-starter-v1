from pathlib import Path
import subprocess,json,datetime,sys,os,signal,time,urllib.request,shutil
m=json.loads(Path('/tmp/stark-qa-current.json').read_text());w=Path(m['work']);e=Path(m['evidence']);phase=sys.argv[1]
def ports():
 return {str(p):[r for f in ['/proc/net/tcp','/proc/net/tcp6'] for r in Path(f).read_text().splitlines()[1:] if int(r.split()[1].split(':')[1],16)==p and r.split()[3]=='0A'] for p in [3000,3001,3002,3003,8000]}
def record(name,cmd,code,start):
 obj={'name':name,'command':cmd,'cwd':str(w),'started':start,'finished':datetime.datetime.now(datetime.timezone.utc).isoformat(),'exit_code':code,'log':name+'.log'}
 with (e/'commands.jsonl').open('a') as out:out.write(json.dumps(obj)+'\n')
 print(json.dumps(obj),flush=True)
def command(name,cmd,env=None):
 start=datetime.datetime.now(datetime.timezone.utc).isoformat()
 with (e/(name+'.log')).open('w') as log:r=subprocess.run(cmd,cwd=w,env=env,stdout=log,stderr=subprocess.STDOUT)
 record(name,cmd,r.returncode,start);return r.returncode
pstate=ports();(e/('ports-'+phase+'-before.json')).write_text(json.dumps(pstate,indent=2))
port=next((p for p in [3001,3002,3003] if not pstate[str(p)]),None)
if port is None:raise SystemExit('BLOCKED: no approved free port')
base='http://127.0.0.1:'+str(port)
print('Selected',base,flush=True)
env=os.environ.copy();env['PLAYWRIGHT_HTML_OUTPUT_DIR']=str(e/'playwright-report');env['QA_PORT']=str(port)
if phase=='automated':
 cmd=['npm','run','test:e2e','--','--output',str(e/'test-results')]
 if port!=3001:
  cfg="""import base from './playwright.config';
import { defineConfig } from '@playwright/test';
const port = Number(process.env.QA_PORT);
if (![3002,3003].includes(port)) throw new Error('Unexpected QA port');
export default defineConfig({...base,use:{...base.use,baseURL:`http://127.0.0.1:${port}`},webServer:{command:`node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port ${port}`,url:`http://127.0.0.1:${port}`,reuseExistingServer:false,gracefulShutdown:{signal:'SIGTERM',timeout:5000}}});
"""
  (w/'qa-port.config.ts').write_text(cfg);shutil.copyfile(w/'qa-port.config.ts',e/'qa-port.config.ts');cmd+=['--config','qa-port.config.ts']
 code=command('e2e',cmd,env)
 for name in ['desktop','mobile']:
  src=w/'QAM/evidence'/(name+'.png')
  if src.exists():shutil.copyfile(src,e/('existing-'+name+'.png'))
 (e/'ports-automated-after.json').write_text(json.dumps(ports(),indent=2));sys.exit(code)
shutil.copyfile('/tmp/stark-qa-independent.cjs',w/'qa-independent.cjs')
shutil.copyfile('/tmp/stark-qa-independent.cjs',e/'qa-independent.cjs')
cmd=['npm','run','dev' if phase=='dev' else 'start','--','--hostname','127.0.0.1']
if port!=3001:cmd+=['--port',str(port)]
started=datetime.datetime.now(datetime.timezone.utc).isoformat();code=1;info={'phase':phase,'command':cmd,'port':port,'baseURL':base,'started':started}
with (e/(phase+'-server.log')).open('w') as log:
 proc=subprocess.Popen(cmd,cwd=w,stdout=log,stderr=subprocess.STDOUT,start_new_session=True);info['pid']=proc.pid;info['processGroup']=proc.pid
 try:
  for _ in range(120):
   if proc.poll() is not None:raise RuntimeError('QA server exited before ready')
   serverlog=(e/(phase+'-server.log')).read_text()
   if 'Ready in' in serverlog:
    with urllib.request.urlopen(base,timeout=30) as response:
     body=response.read().decode();info['httpStatus']=response.status
     if response.status!=200 or 'Make room for your next idea.' not in body:raise RuntimeError('QA homepage not ready')
    break
   time.sleep(0.5)
  else:raise RuntimeError('QA server readiness timed out')
  info['ready']=True
  if phase=='dev':command('dev-http',['curl','--fail','--silent','--show-error',base+'/'])
  driver=['node',str(w/'qa-independent.cjs'),base,str(e/('dev' if phase=='dev' else 'independent' if phase=='production' else 'independent-recheck'))]
  if phase=='dev':driver+=['--smoke']
  driver+=sys.argv[2:]
  code=command(phase+'-browser',driver)
 except Exception as error:
  info['error']=str(error);print(str(error),flush=True)
 finally:
  if proc.poll() is None:os.killpg(proc.pid,signal.SIGTERM)
  try:proc.wait(timeout=10)
  except subprocess.TimeoutExpired:os.killpg(proc.pid,signal.SIGKILL);proc.wait()
  # SIGTERM was sent only to our own newly created process group.
  info['serverExitCode']=proc.returncode;info['finished']=datetime.datetime.now(datetime.timezone.utc).isoformat();info['checkExitCode']=code
  (e/(phase+'-lifecycle.json')).write_text(json.dumps(info,indent=2));(e/('ports-'+phase+'-after.json')).write_text(json.dumps(ports(),indent=2));print(json.dumps(info),flush=True)
sys.exit(code)
