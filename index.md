---
layout: page
title: Edit ABC
---
If you'd like more information on the ABC format check out the
<a href="http://abcnotation.com/wiki/abc:standard:v2.2">ABC Notation</a>
guide.

<div class="row">
    <!-- Draw the dots -->
    <div class="output">
        <div id="abcPaper" class="abcPaper"></div>
    </div>

    <!-- Controls for ABC player -->
    <div id="ABCplayer"></div>
</div>
<!-- Group the input and controls for ABC-->
<div class="row">
    <h3>Open an ABC file:</h3>
    <input type="file" id="files" class='filterButton' name="files[]" accept=".abc" />
    <output id="fileInfo"></output>
    <p />
</div>
<div class="row">
    <h3>Or paste your ABC here:</h3>
    <!-- Read the modified ABC and play if requested -->
    <textarea name='abc' id="textAreaABC" class="abcText" rows="13" spellcheck="false"></textarea>
    <!-- Show ABC errors -->
    <div id='warnings'></div>
</div>
<div class="row">
    <!-- Allow the user to save their ABC-->
    <h3>Don’t forget to Save ABC’ to save your work:</h3>
    <form>
        <span title="Save the ABC you've entered. Don't lose your work!">
            <input value='Save ABC' type='button' class='filterButton'
                onclick='wssTools.downloadABCFile(document.getElementById("textAreaABC").value)' />
        </span>
    </form>
    <p />
</div>

<script>
$(document).ready(function () {
    // Check for the various File API support.
    var fileInfo = document.getElementById('fileInfo');
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('files').addEventListener('change', handleABCFileSelect, false);
    } else {
        fileInfo.innerHTML = 'The File APIs are not fully supported in this browser.';
    }
    
    // Create the ABC player
    document.getElementById('ABCplayer').innerHTML = abcPlayer.createABCplayer('textAreaABC', '1', '{{ site.defaultABCplayer }}');  
    abcPlayer.createABCsliders("textAreaABC", '1');
    
 
});

function handleABCFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.target.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();

        reader.onload = function(e) {
            // Is ABC file valid?
            if ((abcPlayer.getABCheaderValue("X:", this.result) == '')
                || (abcPlayer.getABCheaderValue("T:", this.result) == '')
                || (abcPlayer.getABCheaderValue("K:", this.result) == '')) { fileInfo.innerHTML = "Invalid ABC file";
                return (1);
            }

            // Show the dots
            textAreaABC.value = this.result; 
            
            // Display the ABC in the textbox as dots
            let abc_editor = new window.ABCJS.Editor("textAreaABC", { paper_id: "abcPaper", warnings_id:"abcWarnings", render_options: {responsive: 'resize'}, indicate_changed: "true" });

            
            // stop tune currently playing if needed
            var playButton = document.getElementById("playABC1");
            if (typeof playButton !== 'undefined'
                && playButton.className == "stopButton") {
                abcPlayer.stopABCplayer();
                playButton.className = "";
                playButton.className = "playButton";
            }
        };
        reader.readAsText(f);
    }
}
</script>

<script type="module">
// This is the "Offline copy of pages" service worker

// Add this below content to your HTML page inside a <script type="module"></script> tag, or add the js file to your page at the very top to register service worker
// If you get an error about not being able to import, double check that you have type="module" on your <script /> tag

/*
 This code uses the pwa-update web component https://github.com/pwa-builder/pwa-update to register your service worker,
 tell the user when there is an update available and let the user know when your PWA is ready to use offline.
*/

import 'https://cdn.jsdelivr.net/npm/@pwabuilder/pwaupdate';

const el = document.createElement('pwa-update');
document.body.appendChild(el);
</script>