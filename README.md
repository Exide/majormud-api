# MajorMUD API
An HTTP REST interface for accessing versioned MajorMUD information.

## How to use the interface
It utilizes [HAL](https://en.wikipedia.org/wiki/Hypertext_Application_Language) response syntax to provide self-documentation. This means you can send a `GET` to the root of the API and discover what is possible.
```bash
$ curl -X GET localhost
```
```json
{
  "_links": {
    "self": {
      "href": "http://localhost"
    },
    "versions": {
      "href": "http://localhost/versions",
      "description": "Lists all available versions of MajorMUD data."
    }
  }
}
```

From here you can see that the top-level resource is `versions`.
```bash
$ curl -X GET localhost/versions
```
```json
{
  "_links": {
    "self": {
      "href": "http://localhost/versions"
    },
    "name": {
      "href": "http://localhost/versions/:name",
      "description": "Return a specific version by name."
    }
  },
  "versions": [
    "1.11p"
  ]
}
```

The response shows a single version currently available, `1.11p`. You can also see how to query that specific version.
```bash
$ curl -X GET localhost/versions/1.11p
```
```json
{
  "_links": {
    "self": {
      "href": "http://localhost/versions/1.11p"
    },
    "items": {
      "href": "http://localhost/versions/1.11p/items",
      "description": "List all items in version 1.11p."
    }
  }
}
```

Now to explore the `items` resource for version `1.11p`, we simply send a `GET` to the link shown.
```bash
$ curl -X GET localhost/versions/1.11p/items
```
```json
{
  "_links": {
    "self": {
      "href": "http://localhost/versions/1.11p/items"
    },
    "id": {
      "href": "http://localhost/versions/1.11p/items/:id",
      "description": "Return a specific item by ID."
    },
    "name": {
      "href": "http://localhost/versions/1.11p/items?name=:keyword",
      "description": "List all items that contain the keyword in the name."
    }
  },
  "items": [ ... ]
}
```

Finally, you can see in the links section that you can get a single item by supplying its unique ID or filtering all items by name using a keyword.
```bash
$ curl -X GET localhost/versions/1.11p/items/1
```
```bash
$ curl -X GET localhost/versions/1.11p/items?name=sword
```

## Development

To build everything:
```bash
$ gulp
```

To build a specific endpoint:
```bash
$ gulp [function name]
```
