const electron = require('electron')

const {Menu, Tray} = require('electron');


// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let appIcon = null;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 300, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  appIcon = new Tray('C:\\dev\\ADFAgent\\1464083570_Ok.ico');
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Item1', type: 'radio'},
    {label: 'Item2', type: 'radio'},
    {label: 'Item3', type: 'radio', checked: true},
    {label: 'Item4', type: 'radio'}
  ]);
  appIcon.setToolTip('ADFAgent');
  appIcon.setContextMenu(contextMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

console.log('ready!!');


var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://112.223.76.75:11883');

client.on('connect', function () {
  client.subscribe('presence');
  client.publish('presence', 'Hello mqtt');
  appIcon.setImage('C:\\dev\\ADFAgent\\1464083570_Ok.ico');
});

client.on('offline', function () {
  appIcon.setImage('C:\\dev\\ADFAgent\\1464083585_Cancel.ico');
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  //client.end();
});


// database test
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');

db.serialize(function() {
    db.run("CREATE TABLE if not exists lorem (info TEXT)");

    var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
        console.log(row.id + ": " + row.info);
    });
});

db.close();
