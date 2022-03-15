# babel-preset-tr
Tr preset based on babel

## config

babel.config.json

```json
{
  "presets": [["@hangteam/babel-preset-tr", {}]]
}
```

## options

|     name      |          type          |          default          |           description           |
| :-----------: | :----------------------: | :-----------------------------: | :-----------------------------: |
| autoInjection | {Boolean} | true | Automatic inject 'Tr' variable |
| from | {String} | '@hangteam/tr' | Automatic get the path of 'Tr' variable |

