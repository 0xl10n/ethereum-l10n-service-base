// const ffmpeg = require('fluent-ffmpeg');
// const fs = require('fs');

// /**
//  * Splits an audio file into two equal parts.
//  * @param {string} inputFile Path to the input audio file.
//  * @param {function} callback Callback function for when processing is complete.
//  */
// function splitAudioIntoTwo(inputFile: File, callback) {
//   // First, get the duration of the audio file
//   ffmpeg.ffprobe(inputFile, function (err, metadata) {
//     if (err) {
//       return callback(err);
//     }

//     const duration = metadata.format.duration;
//     const halfDuration = duration / 2;

//     // Split the audio into two parts using the duration data
//     let partCounter = 0;
//     ffmpeg(inputFile)
//       .on('error', function (err) {
//         console.log(`An error occurred: ${err.message}`);
//         callback(err);
//       })
//       .on('end', function () {
//         console.log(`Processing finished! Part ${++partCounter}`);
//         if (partCounter === 2) {
//           callback(null, 'Both parts have been created.');
//         }
//       })
//       // Output part 1
//       .output(`part1_${inputFile}`)
//       .setStartTime(0)
//       .duration(halfDuration)
//       .audioCodec('copy') // Using 'copy' to avoid re-encoding
//       // Output part 2
//       .output(`part2_${inputFile}`)
//       .setStartTime(halfDuration)
//       .duration(halfDuration)
//       .audioCodec('copy') // Using 'copy' to avoid re-encoding
//       .run();
//   });
// }

// // Example usage:
// splitAudioIntoTwo('path/to/your/audio.mp3', (error, message) => {
//   if (error) {
//     console.error('Error:', error);
//   } else {
//     console.log(message);
//   }
// });
