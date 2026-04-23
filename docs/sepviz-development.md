## Initial setup
From the vsrocq project root:
```
nix develop .#vsrocq-8-20

cd client
yarn run install:all
yarn run build:all
yarn run compile
```

## Test the extension on a rocq project 
Take the rocq project `cfml-examples` as an example.
```
nix develop /path/to/cfml-examples # get cfml-examples dependencies
nix develop .#vsrocq-8-20
code . # open vsrocq in the vscode 
```
Then, open `client/extension.ts`, and press `F5` to compile and run the extension in a new Extension Development Host window.
From that window, open the project `cfml-examples`. 
From the command palette, type "Developer: Togger Developer Tools" for the developer tools.