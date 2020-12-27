---
layout: page
title: editABC
---
<script type="module">
import 'https://cdn.jsdelivr.net/npm/@pwabuilder/pwaupdate';

const el = document.createElement('pwa-update');
document.body.appendChild(el);
</script>

<div class="row">
    <!-- Controls for ABC player -->
    <div id="ABCplayer"></div>
    
    <!-- Draw the dots -->
    <div class="output audioParentOuter">
        <div id="abcPaper" class="abcPaper"></div>
    </div>
</div>
<!-- Group the input and controls for ABC-->
<div class="row">
    <h3>Type your ABC here:</h3>
    <!-- Read the modified ABC and play if requested -->
    <textarea name='abc' id="textAreaABC" class="abcText" aria-label="textarea ABC" rows="13" spellcheck="false"></textarea>
    <!-- Show ABC errors -->
    <div id='abcWarnings'></div>
</div>
<div class="row">
    <h3>Or open an ABC file:</h3>
    <input type="file" id="files" class='filterButton' aria-label="Open ABC file" name="files[]" accept=".abc" />
    <output id="fileInfo"></output>
    <p />
</div>
<div class="row">
    <!-- Allow the user to save their ABC-->
    <h3>Don’t forget to 'Save ABC’ to save your work:</h3>
    <form>
        <input value='Save ABC' type='button' class='filterButton'
            onclick='wssTools.downloadABCFile(document.getElementById("textAreaABC").value)' />
    </form>
    <p />
</div>

{% include js-libs.html  %}

<script>
$(document).ready(function () {
    // Check for the various File API support.
    var fileInfo = document.getElementById('fileInfo');
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('files').addEventListener('change', handleABCFileSelect, false);
    } else {
        fileInfo.innerHTML = 'The File APIs are not fully supported in this browser.';
    }
    
    // Display the ABC in the textbox as dots
    let abc_editor = new window.ABCJS.Editor("textAreaABC", { paper_id: "abcPaper", warnings_id:"abcWarnings", render_options: {responsive: 'resize'}, indicate_changed: "true" });
    
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

