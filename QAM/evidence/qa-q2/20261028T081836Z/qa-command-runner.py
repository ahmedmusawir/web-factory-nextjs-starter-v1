from pathlib import Path
import subprocess,json,datetime,sys,os
m=json.loads(Path('/tmp/stark-qa-current.json').read_text());e=Path(m['evidence']);name=sys.argv[1];cmd=sys.argv[2:]
start=datetime.datetime.now(datetime.timezone.utc).isoformat()
with (e/(name+'.log')).open('w') as log:
 result=subprocess.run(cmd,cwd=m['work'],stdout=log,stderr=subprocess.STDOUT)
record={'name':name,'command':cmd,'cwd':m['work'],'started':start,'finished':datetime.datetime.now(datetime.timezone.utc).isoformat(),'exit_code':result.returncode,'log':name+'.log'}
with (e/'commands.jsonl').open('a') as out:out.write(json.dumps(record)+'\n')
print(json.dumps(record));sys.exit(result.returncode)
