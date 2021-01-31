---
layout: page
title: editABC
---
<script type="module">
/*
 This code uses the pwa-update web component https://github.com/pwa-builder/pwa-update to register your service worker,
 tell the user when there is an update available and let the user know when your PWA is ready to use offline.
*/

import 'https://cdn.jsdelivr.net/npm/@pwabuilder/pwaupdate';

const el = document.createElement('pwa-update');
document.body.appendChild(el);
</script>

<!-- Draw the dots -->
<div class="row">
    <div id="abcPaper" class="abcPaper"></div>
        <!-- Show ABC errors -->
    <div id='abcWarnings' class='abcWarnings'></div>
    <div id="abcAudio"></div>    
</div>

<label for="filesRow">Open an ABC file:</label>
<div id="filesRow" class="row small-up-1 medium-up-2 large-up-2">
    <!-- Group the input and controls for ABC-->
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
<ul>
    <li>The <strong>dots</strong> won't appear at the top of the page until you load a file, cut and paste some ABC into the textarea below or type the details in manually. The page can handle one tune at a time. You should <strong>Reset the Page</strong> between tunes.</li>
    <li>This page is built as a Progressive Web App which means you can install it as a Web App if you use Chrome on desktop machines and as a desktop app on Android phones.</li> 
    <li>You may find some interesting behaviour around caching in the browser. This is my first cut at a PWA.</li>
</ul>
<p>The code for this page is freely available on GitHub at <a href="https://github.com/slow-session/editABC/">https://github.com/slow-session/editABC/</a>. Bugs etc to asjl@lpnz.org please!</p>

<h4>Acknowledgments</h4>

<p>The page uses the most excellent <strong>abcjs</strong> Javascript tools written by Paul Rosen and Gregory Dyke available <a href="https://www.abcjs.net/">here.</a> Many thanks to them for all their fine work on this.</p>

</div>

<div class="row">
    <textarea name='abc' id="textAreaABC" class="abcText" aria-label="textarea ABC" rows="13" spellcheck="false" placeholder="Or type your ABC here..."></textarea>
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
                displayLoop: false,
                displayRestart: true,
                displayPlay: true,
                displayProgress: true,
                displayWarp: false,
            }
        }
    });
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
            if ((wssTools.getABCheaderValue("X:", this.result) == '')
                || (wssTools.getABCheaderValue("T:", this.result) == '')
                || (wssTools.getABCheaderValue("K:", this.result) == '')) { fileInfo.innerHTML = "Invalid ABC file";
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

function resetEditABCpage () {
    document.getElementById("abcPaper").innerHTML = '';
    document.getElementById("abcPaper").style.paddingBottom = "0px";
    document.getElementById("abcPaper").style.overflow = "auto";
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
