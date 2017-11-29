function testConnection(){
    
    var webSiteObj = {};        // Web site info     
    var siteGroup = {           // Web site group
        "g0":[],
        "g1":[],
        "g2":[]
    };
    var siteGroupRecord = [];   // Store index of group that had been used

    var resultAry = [];     // Store the result of speed test
    var targetImg = "/images/benchmark/benchmark.jpg"; //URL of target picture, use uncompressed jpg to test.
    
    var redirectFlag = 0;    
    var downloadSize = 53267; //bytes, size of the target image.

    // Initial connection speed test(Use image download speed to test.)
    this.InitiateWebSiteGroup = function(urlObj,urlObj_m) {
        console.log('Running server test.');
        
        webSiteObj = urlObj;
        mobileSiteObj = urlObj_m;
        
        // Get the amount of website needed to be tested
        var dummyAry = Object.keys(webSiteObj);
        objLength = dummyAry.length;

        // Group into 3 groups, or any other count.
        var remainder = objLength % 3;
        var numPerG = (objLength-remainder) / 3;
        var xtraNum = objLength-remainder;
        var count = 0;
        var remainCount = numPerG;
        for(var i = 0;i < 3;i++){

            for(var x = 0;x<numPerG;x++){

                siteGroup['g'+i].push(count);
                count++;

            }
            // Give the remainder to the last group
            if(xtraNum<objLength){
                siteGroup['g'+i].push(xtraNum);
                xtraNum++;
            }
        }
    };

    this.initSpeedTest = function(group,mFlag){
        // Detecting start
        var key = 0;
        var objLength = siteGroup[group].length;
        mobileBrowser = mFlag;
        $('#connectMsg').html('Testing...');
        runTest(group,objLength,key);
        
        // Setup a 10 sec counter.
        setTimeout(function(){
            receiveConsole(2,group);
        },10000);
    }

    function receiveConsole(flag,group){
        siteGroupRecord.push(group);
        
        // Check if received response of every website
        if(flag==1&&redirectFlag==0){            
            $('#connectMsg').html('Calculation status: 100%');
            redirectFlag++;
            var errorCount = 0;      
            for(var i = 0;i<resultAry.length;i++){
                if(resultAry[i].urlThis=='error'){
                    errorCount++;
                }
            }
            if(errorCount<resultAry.length){
                window.location.href = findFastestSite();
                // findFastestSite();
                redirectFlag++;
            }else{
                console.log('Next group');                
                findNextGroup(group);
            }

        }

        // Check if time up
        if(flag==2&&redirectFlag==0){
            $('#connectMsg').html('Time out, retrieving data fragments...');
            redirectFlag++;
            var errorCount = 0;      
            for(var i = 0;i<resultAry.length;i++){
                if(resultAry[i].urlThis=='error'){
                    errorCount++;
                }
            }
            if(errorCount<resultAry.length){
                window.location.href = findFastestSite();
                // findFastestSite();
                redirectFlag++;
            }else{
                console.log('Next group');
                
                findNextGroup(group);
            }
            
        }                
    }
    
    function findNextGroup(group){
        $('#connectMsg').html('Redirecting to target URL');
        // siteGroup
        for(var i in siteGroup){
            if(siteGroupRecord.indexOf(i)==-1){
                var nextGroup = i;
                break;
            }
        }

        // Reset
        redirectFlag = 0;   
        resultAry = [];
        
        // If there is no response from all listed URL, show error message.
        if(nextGroup === undefined){
            $('#loadingIcon').hide();
            
            $('#connectMsg').html(
                'Oh no! No response!'
            );            
            return;
        }
        
        // Init speed test for next group of url if there is no response from every URL from last group.
        var key = 0;
        var objLength = siteGroup[nextGroup].length;
        runTest(nextGroup,objLength,key);
        // console.log(resultAry);
        setTimeout(function(){
            receiveConsole(2,nextGroup);
        },5000);
    }

    // Start loop that loop through list of URL for speed testing
    var runTest = function(group,objLength,key,callback){
        
        MeasureConnectionSpeed(group,key,function(){
            
            key++;
            
            if(key<objLength){
                runTest(group,objLength,key);
            }

        });

    }

    // Speed test code from someone on StackOverFlow, can't remember where I find it.
    function MeasureConnectionSpeed(group,prop,callback) {
        
        var startTime, endTime;
        var download = new Image();

        download.onload = function () {
            endTime = (new Date()).getTime();
            // showResults(prop);            
            var duration = (endTime - startTime) / 1000;
            var bitsLoaded = downloadSize * 8;
            var speedBps = (bitsLoaded / duration).toFixed(2);
            var speedKbps = (speedBps / 1024).toFixed(2);
            var speedMbps = (speedKbps / 1024).toFixed(2);
            resultAry.push({
                "urlThis":      webSiteObj[siteGroup[group][prop]],
                "urlThis_m":    mobileSiteObj[siteGroup[group][prop]],
                "duration":     duration,
                "speedBps":     speedBps,
                "speedKbps":    speedKbps,
                "speedMbps":    speedMbps
            });
            
            $('#connectMsg').html('Searching for best connection speed.');

            if(resultAry.length >= siteGroup[group].length){
                receiveConsole(1,group);
            }
        }
        
        download.onerror = function (err, msg) {
            resultAry.push({
                "urlThis":      'error',
                "urlThis_m":    'error',
                "duration":     10000,
                "speedBps":     0,
                "speedKbps":    0,
                "speedMbps":    0
            });            

            if(resultAry.length >= siteGroup[group].length){                
                receiveConsole(1,group);
            }
        }
        
        startTime = (new Date()).getTime();
        download.src = webSiteObj[siteGroup[group][prop]] + targetImg + "?v="+startTime;
        
        callback();
    }
    
    // Calculate connection speed    
    function findFastestSite(){

        // console.log(webSiteObj);
        var durationSec = resultAry[0].duration;
        var targetUrl = '';
        var count = 0;
        for(var i in resultAry){
            if(durationSec!=0 && durationSec > resultAry[i].duration){                
                count = i;
            }
        }
        targetUrl = resultAry[count].urlThis;
        
        // console.log(targetUrl);
        resultAry = []; // reset
        $('#connectMsg').html('Best connection speed found');
        return targetUrl;
    }    

}