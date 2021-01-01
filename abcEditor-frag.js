abcEditor = new window.ABCJS.Editor("textAreaABC", {
        paper_id: "abcPaper", 
        warnings_id:"abcWarnings", 
        render_options: {responsive: 'resize'}, 
        indicate_changed: "true", 
    });

    if (ABCJS.synth.supportsAudio()) {
	    var synthControl = new ABCJS.synth.SynthController();
	    synthControl.load("#abcAudio", 
            {
                displayLoop: true, 
                displayRestart: true, 
                displayPlay: true, 
                displayProgress: true, 
                displayWarp: true
            }
        );
    }