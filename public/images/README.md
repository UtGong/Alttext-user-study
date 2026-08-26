# Study image assets

Place each selected image in this directory using the exact `imageFilename` value from
`data/stimuli.json`, for example:

```text
public/images/sample_7ef08b06-e4ff-49e5-8c13-f79dd0b1a872.png
```

The study image control resolves these files at `/images/<imageFilename>`. If a future stimulus
provides an explicit `imageUrl`, that URL takes precedence.
