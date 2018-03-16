# dispatcher-ws

## Usage

### Install

Clone source code from Git repository:

```shell
git clone https://github.com/pnhung177/stormeye-dispatcher-ws.git
cd stormeye-dispatcher-ws
```

Install NPM dependencies:

```shell
npm install
```

Launch the service:

```shell
NODE_ENV=test \
DEBUG=app*,dispatcher* \
LOGOLITE_DEBUGLOG_ENABLED=true \
node index.js
```
