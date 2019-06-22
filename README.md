# MajorMUD API
An HTTP REST interface for accessing versioned MajorMUD information.

## Endpoints

### Get item by ID
```bash
$ curl -X GET localhost/v/latest/item/78
```
```json
```

### Get items by name
```bash
$ curl -X GET localhost/v/latest/items/greatsword
```
```json
[
  {
    "id": 78,
    "name": "greatsword",
    "description": "This is a massive, double-handed axe with a shaft made out of the petrified bone of some unknown creature. Its blade is huge and heavy, and its single edge appears to be razor-sharp.",
    "type": "weapon",
    "class": "two-handed sharp",
    "minimum_damage": 7,
    "maximum_damage": 30,
    "speed": 2200,
    "level": 0,
    "strength_desired": 80,
    "weight": 225,
    "armour_class": 2,
    "damage_reduction": 0,
    "accuracy_modifier": 5,
    "backstab_modifier": 0,
    "can_backstab": false,
    "critical_modifier": 0,
    "is_limited": true,
    "limited_to_count": 5,
    "hit_magic": 1,
    "quality": 100,
    "dropped_by": [
      { "id": 60, "chance": 0.25 }
    ],
    "can_be_sold_at": [
      { "id": 88 }
    ]
  }
]
```
