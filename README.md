# MajorMUD API
An HTTP REST interface for accessing versioned MajorMUD information.

## Endpoints

### Index
```bash
$ curl -X GET localhost
```
Returns [index.html](/static/index.html)

### Get item by ID
```bash
$ curl -X GET localhost/v/:version/item/:id
```
Calls [get-item-by-id.ts#handler](/src/get-item-by-id.ts)

### Get items by name
```bash
$ curl -X GET localhost/v/:version/items/:name
```
Calls [get-items-by-name.ts#handler](/src/get-items-by-name.ts)

## Development

To build everything:
```bash
$ gulp
```

To build a specific endpoint:
```bash
$ gulp [function name]
```

To upload static files:
```bash
$ gulp static
```
