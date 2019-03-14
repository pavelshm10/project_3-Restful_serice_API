//$(function(){
    async function getAllData(set){
        var last,diff,addCoin;
        try {
            let response=await fetchData("https://api.coingecko.com/api/v3/coins/list");   
            
            for (var i = 0; i < 100 ; i++){  
                var symbol = response[i].symbol;
                var name = response[i].name;
                var id = response[i].id;
                var symbolUp=symbol.toUpperCase();
                var coin="<div class='coins'><b>"+symbolUp
                +"</b><label class='switch'>"
                +"<input  id='"+symbol+"' class='check' type='checkbox'>"
                +"<span class='slider round'></span>"
                +"</label>"
                +"<br>"+name+"<br><br>"
                +"<button id='"+id+"' class='button btn btn-primary' type='button' data-toggle='collapse' data-target='#"+i+"'>More Info</button><br>"
                +"<div class='collapse' id='"+i+"' height='100' width='50'><br>"
                +"</div>"
                +"</div>"
                $("#home").append(coin); 
            }  
                
            $(".button").on("click", function(){             
                let id=this.id;
                var x=$(this).closest("div.coins").find("div");
                var divId=x.attr("id"); 
                //get data for the first enterance
                if(localStorage.getItem(divId)==null){
                    getMoreInfo(divId,id); 
                }
                else if(last){
                    diff = event.timeStamp - last; 
                    if(diff>=20000){
                        $("#"+id+divId+"").remove();
                        getMoreInfo(divId,id);
                    }
                }
                last = event.timeStamp;   
            });
            
            async function getMoreInfo(divId,id){
                try {
                    let response=await fetchData("https://api.coingecko.com/api/v3/coins/"+id);           
                        var moreInfo=response.market_data.current_price.usd+"$<br>"
                        +response.market_data.current_price.eur+"&#8364<br>" 
                        +response.market_data.current_price.ils+"&#8362"; 
                        $("#"+divId+"").prepend("<div id='"+id+divId+"'><img src='" + response.image.small + "'><br>"+moreInfo+"</div>");           
                        localStorage.setItem(divId,divId);
                    }
                catch (error) {
                    alert("Error: " + error.status);
                    //$("#data").append("Error: " + error.status);
                }
            }
    
            $(".check").on("click",function(){
                var coinSymbol=this.id;
                if(set.has(coinSymbol)){
                    set.delete(coinSymbol);
                }
                else if(set.size==5){
                    $("#"+coinSymbol).prop("checked", false);
                        $(".checkbox").remove();
                        for(let val of set.values()) {
                            var values="<div class='checkbox'><input  type='checkbox' id='"+val+val+"' value="+val+">"+val+"</div>";
                            $("#list").append(values);
                        }
                        $("#checkModal").modal("show");
                        addCoin=this.id;
                }
                else{
                    set.add(coinSymbol);
                }
                $("#checkBtn").on("click",function(){
                    
                    if($("#"+coinSymbol+coinSymbol+":checkbox:checked").length>0){   
                        set.delete(coinSymbol);
                        $("#"+coinSymbol).prop("checked", false);
                        set.add(addCoin);
                        $("#"+addCoin).prop("checked", true);
                    }
                });
            });  
        }//try
    
        catch (error) {
            alert("Error: " + error.status);
            //$("#data").append("Error: " + error.status);
        }
    }//get data
    function fetchData(url){
        let myPromise = new Promise((resolve, reject) => {
            $("#myModal").modal("show");
            $(".loader").show();
            $.ajax({
                method: "GET",
                url: url,
                success: function (response) {
                    resolve(response);
                },
                error: function (error) {
                    reject(error);
                },
                complete: function(){
                    $("#myModal").modal("hide");
                    $(".loader").hide();
                }
            });
        });
        return myPromise;
    }
//});