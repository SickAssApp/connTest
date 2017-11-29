<?php 
    $webAry = array(
        'https://www.demourl1.com',
        'https://www.demourl2.com',
        'https://www.demourl3.com'
    );

    // Randomize the url array, unmark below if needed
    /*

    $len = count($webAry)-1;
    
    $randAry = range(0,$len);
    shuffle($randAry);
    $jsonAry = array();
    
    foreach($randAry as $key=>$val){
        $jsonAry[$key] = $webAry[$val];
    }

    $webJSON = json_encode($jsonAry,JSON_FORCE_OBJECT);*/
    $webJSON = json_encode($webAry,JSON_FORCE_OBJECT);
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redirect</title>
        <link rel="stylesheet" href="../styles/styles.css" />        
        <script src="../scripts/jquery-3.1.0.min.js"></script>
        <script src="../scripts/measure.js"></script>

        <script>
        $(document).ready(function(){
            // Convert string to JSON
            var urlStr = '<?php echo $webJSON;?>';
            var urlObj = JSON.parse(urlStr);

            var tConnect = new testConnection();
                        
            // Click event binded to random object
            // var $link = $('ul li');
            // $link.on('click',function(){

            //     tConnect.InitiateWebSiteGroup(urlObj,urlObj_m);                

            // });                                    

            /* Test connection speed between client & target server */
            (function(){                                
                tConnect.InitiateWebSiteGroup(urlObj,urlObj_m);
            })();
        });
        </script>
	</head>
	<body>
        <header>            
            <!--<button id="tryRedirect">Witness me!</button>-->
        </header>
        <section>                        
            
            <article class="website">
                <div class="category">
                    <h2>Demo Site</h2>
                </div>
                <!-- <ul>
                    <li class="icon_1" id="li_0" data-name="webRedirect0">
                        <h3>Demo 1</h3>
                    </li>
                    <li class="icon_1" id="li_1" data-name="webRedirect1">
                        <h3>Demo 2</h3>
                    </li>
                    <li class="icon_1" id="li_2" data-name="webRedirect2">
                        <h3>Demo 3</h3>
                    </li>                    
                </ul> -->
                <div style="clear:both;"></div>
            </article>            
        
        <!-- Loading Icon animation from http://tobiasahlin.com/spinkit/ -->
        <div class="dialog-container" id="panelContainer">

            <div class="dialog-panel" id="statusPanel">
                <div class="sk-cube-grid" id="loadingIcon">
                    <div class="sk-cube sk-cube1"></div>
                    <div class="sk-cube sk-cube2"></div>
                    <div class="sk-cube sk-cube3"></div>
                    <div class="sk-cube sk-cube4"></div>
                    <div class="sk-cube sk-cube5"></div>
                    <div class="sk-cube sk-cube6"></div>
                    <div class="sk-cube sk-cube7"></div>
                    <div class="sk-cube sk-cube8"></div>
                    <div class="sk-cube sk-cube9"></div>
                </div>
                <p id="connectMsg" style="text-align:center;">Loading...</p>
            </div>
        </div>

	</body>
</html>