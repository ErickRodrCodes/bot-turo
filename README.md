# bot-turo
An automated bot that will upload videos on youtube.

## what is this?
in eSport productions is common to generate dozens (if not HUNDREDS) of footage ready to be uploaded to Youtube. Complex problem here is that there is few time for the editor to upload on bulk and ensure each footage gets properly updated. This bot is specially useful when you are creating footage on demand and it requires immediate upload to youtube.

## Expected features

- easy metadata your video using a word document with ALL the required fields it needs to use. Idea here is to rank up your uploaded video as soon as possible in the shortest time possible
- upload on demand: Once you produce your raw video, it will upload right away with the expected metadata from the word document. The program will listen to changes on the folder and if there are new videos on it, the program will queue those with the metadata created from the document. 
- Individualized meta-taggin: it will be possible to create individual word documents with a template metatag data. you can leave your video uploading and process the metatags for that video in a separate word document. The program should eventually check what documents have changed and update the metatags for the respective video.
- Automatic thumbnail: It is possible that, depending on certain values on the metadata, you could automatically generate a thumbnail. That is in another level but quite cool to have predeterminated templates that will take data from the document.
- In the development department, upgrading the current code to TypeScript to make it easy to build in a modular way, as well having all sort of toys that allows clean and tidy development.

## Requirements
Suggested to use NVS (a global package that allows you to switch node versions). If you are using in another project a recent version of node, it comes handy to use NVS to fetch the correct one and allow compatibility.
- Node v12.16.3
- yarn 1.22.10
- nvs 1.6.0

Additional steps will added as this repo is ongoing being updated.
