# MajorMUD API
An HTTP REST interface for accessing versioned MajorMUD information.

## Interface structure
This is designed to be an explorable, hierarchal interface. You will find all the top-level objects, including links to explore them, by browsing the root of the interface. 

## Building & Deploying
[Gulp](https://gulpjs.com/) is used to orchestrate building and deploying the code. For the gory details, check out the [gulpfile.js](/gulpfile.js) file.

Command: ```gulp [function ...]```

Build and deploy everything
```bash
$ gulp
```

Build and deploy a single function
```bash
$ gulp get-index
```

Build and deploy select functions
```bash
$ gulp get-items get-item-by-id
```
