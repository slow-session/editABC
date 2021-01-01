---
layout: page
title: editABC
---

<!-- Draw the dots -->
<div class="row">
    <div id="abcPaper" class="abcPaper"></div>
        <!-- Show ABC errors -->
    <div id='abcWarnings' class='abcWarnings'></div>
    <div id="abcAudio"></div>    
</div>

<div class="row small-up-1 medium-up-2 large-up-2">
    <!-- Group the input and controls for ABC-->
    <h3>Open an ABC file or type your ABC below:</h3>
    <div class="small-9 columns">
        <input type="file" id="files" class='filterButton' aria-label="Open ABC file" name="files[]" accept=".abc" />
    </div>
    <output id="fileInfo"></output>
    <div class="small-3 columns">
        <input value='Show Help' id='help' type='button' class='filterButton' aria-label="Help" onclick='toggleHelp(this)'/>
    </div>
</div>

<div id="editHelp" class="row editHelp">
<h3>Help</h3>

Details to follow....
</div>

<div class="row">
    <textarea name='abc' id="textAreaABC" class="abcText" aria-label="textarea ABC" rows="13" spellcheck="false"></textarea>
</div>

<div class="row small-up-2 medium-up-2 large-up-2">
    <div class="small-6 columns">
        <input value='Save ABC file' id='save' type='button' class='filterButton' aria-label="Save ABC file" onclick='wssTools.downloadABCFile(document.getElementById("textAreaABC").value)' />
    </div>
    <div class="small-3 columns">
        <input value='Reset the page' id='reset' type='button' class='filterButton' aria-label="Reset page" onclick='resetEditABCpage()'/>
    </div>

</div>


<script>
let abcEditor = null;

document.addEventListener("DOMContentLoaded", function (event) {
    // Check for the various File API support.
    var fileInfo = document.getElementById('fileInfo');
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('files').addEventListener('change', handleABCFileSelect, false);
    } else {
        fileInfo.innerHTML = 'The File APIs are not fully supported in this browser.';
    }

    abcEditor = new window.ABCJS.Editor("textAreaABC", {
        paper_id: "abcPaper", 
        warnings_id:"abcWarnings", 
        render_options: {responsive: 'resize'}, 
        indicate_changed: "true", 
        synth: { el: "#abcAudio", options: {
                displayLoop: true,
                displayRestart: true,
                displayPlay: true,
                displayProgress: true,
                displayWarp: true,
            }
        }
    });
});

//console.log(window.ABCJS.instrumentIndexToName[21]);

function handleABCFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.target.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();

        reader.onload = function(e) {
            // Is ABC file valid?
            if ((getABCheaderValue("X:", this.result) == '')
                || (getABCheaderValue("T:", this.result) == '')
                || (getABCheaderValue("K:", this.result) == '')) { fileInfo.innerHTML = "Invalid ABC file";
                return (1);
            }
            // Show the dots
            textAreaABC.value = this.result + '\n';
            
            // Gross hack to get the ABC to draw after file is loaded
            // The option 'drawABChack' doesn't exist and is silently ignored
            // but this forces a redraw
            abcEditor.paramChanged({drawABChack: 1});
        };
        reader.readAsText(f);
    }
}


function getABCheaderValue(key, tuneABC) {
    // Extract the value of one of the ABC keywords e.g. T: Out on the Ocean
    const KEYWORD_PATTERN = new RegExp(`^\\s*${key}`);

    const lines = tuneABC.split(/[\r\n]+/).map(line => line.trim());
    const keyIdx = lines.findIndex(line => line.match(KEYWORD_PATTERN));
    if (keyIdx < 0) {
        return '';
    } else {
        return lines[keyIdx].split(":")[1].trim();
    }
}

function resetEditABCpage () {
    document.getElementById("abcPaper").innerHTML = '';
    document.getElementById("abcPaper").style.paddingBottom = "0px";
    document.getElementById("abcPaper").style.overflow = "auto";
    //textAreaABC.value = "% Set instrument to 'accordion'\n%%MIDI program 21\n";
    textAreaABC.value = "";
    document.getElementById('abcWarnings').innerHTML = 'No errors';
    files.value = '';
}

function toggleHelp(button) {
    switch (button.value) {
        case "Show Help":
            button.value = "Hide Help";
            document.getElementById('editHelp').style.display= "block" ;
            break;
        case "Hide Help":
            button.value = "Show Help";
            document.getElementById('editHelp').style.display= "none" ;
            break;
    }
}
</script>
