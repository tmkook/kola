# kola framework core
Kola is a full-stack framework based on Koa

### config
```
const { config } = require('kola');
config.add({file:{key:{name:"my key value"}}});
config.get('file.key.name'); //return my key value
config.set('file.key',{value:"my key value changed"});
config.get('file.key.value'); //return my key value changed
```

### folder
```
const { folder } = require('kola');
folder.fs // is require('fs');
folder.dir //is require('path')
folder.root('commands'); //framework base path
folder.base('app'); //coding base path
folder.files(path,extention); //return all files
folder.dirs(path); //return all dirs
folder.content(path) //return file content
folder.imports(path) //require all files and return objects
folder.chkdir(path) //create dir
```