// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// let level = require('level')
 
// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
// let db = level('./mydb')

// async function save(){
//     await db.put('halo','18 years old');
//     await db.put('alice','19 years old');
//     await db.put('bob','20 years old');
//     await db.put('carol','21 years old');
// }

// save()
 
// // 2) Put a key & value
// db.put('name', 'Level', function (err) {
//   if (err) return console.log('Ooops!', err) // some kind of I/O error
 
//   // 3) Fetch by key
//   db.get('name', function (err, value) {
//     if (err) return console.log('Ooops!', err) // likely the key was not found
 
//     // Ta da!
//     console.log('name=' + value)
//   })
// })