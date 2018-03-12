$(document).ready(function(){
    var gifApp = {
        gifArray: [],
        btnArray: [],
        slctdBtn: '',
        addBtn: function(btnName)
        {
            var self = this;
            if (self.btnArray.indexOf(btnName) === -1)
            {
                self.btnArray.push(btnName);
                self.show('btns');
                self.saveToLocal();
            }
        },        
        callAPI: function(qVal)
        {
            var self = this,
                url = `https://api.giphy.com/v1/gifs/search?api_key=32OZj5mWP3mgLVVuJfFvw3joHyIUS62T&limit=12&lang=en`;
            
            $.getJSON (`${url}&q=${qVal}`, function(e)
            {
                self.gifArray = e.data;
                self.show('GIFs');
                self.show('btns');
                $('#subTitle').html(`Now Showing <b>${qVal.toUpperCase()}</b> GIFs `);
            });
        },
        getHTML: function(data, index, type)
        {
            var isLast = (type === 'GIFs') ? index === this.gifArray.length : index === this.btnArray.length,
                htmlStart = (index === 1) ? `<div class="row">`: '',
                htmlMid = (type === 'GIFs') ? `<div class="col-sm-6 col-lg-3">
                                                    <div class="card">
                                                        <img class="card-img-top gifThumb" 
                                                        src="${data.images.fixed_width_still.url}"
                                                        data-still="${data.images.fixed_width_still.url}" 
                                                        data-animate="${data.images.fixed_width.url}" 
                                                        data-state="still" class="gif">
                                                        <div class="card-body">
                                                            <p class="card-text"><b>Rating:</b> ${data.rating.toUpperCase()}</p>
                                                        </div>
                                                    </div>
                                                </div>` 
                                            : `<div class="col col-sm-12 col-md-6 col-lg-4">   
                                                    <div class="btn-group" role="group">                                                     
                                                        <button class="btn gifBtn" type="button">
                                                            ${data}
                                                        </button>
                                                        <button class="btn deleteBtn" aria-label="Delete" data-btn="${data}">
                                                            &times;
                                                        </button>     
                                                    </div>
                                                </div>`,
                htmlEnd = (index === ((type === 'GIFs') ? 4 : 3)) ? `</div>` : (isLast) ? `</div>` : '';

            return htmlStart + htmlMid + htmlEnd;
        },  
        getLocalData: function(type)
        {
            var data = (type === 'btnArray') ? JSON.parse(localStorage.getItem(type)) : localStorage.getItem(type);
            this[type] = (data != null) ? data : (type === 'btnArray') ? ['basketball', 'coding', 'sleep', 'music', 'food'] : 'coding';
        },
        gifBtnClick: function(btnName)
        {
            this.slctdBtn = (this.btnArray.indexOf(btnName) != -1) ? btnName : '';
            this.saveToLocal();
            this.callAPI(btnName);

        },
        removeBtn: function(btnName)
        {
            var self = this,
                index = self.btnArray.indexOf(btnName);
                if (index != -1)
                {
                    self.btnArray.splice(index, 1);
                    self.show('btns');
                    self.slctdBtn = (this.btnArray.indexOf(btnName) != -1) ? btnName : '';
                    self.saveToLocal();
                }
        },
        saveToLocal: function()
        {
            localStorage.setItem("btnArray", JSON.stringify(this.btnArray));
            localStorage.setItem("slctdBtn", this.slctdBtn);
        },
        show: function(type)
        {
            var self = this,
                html = '',
                config = {
                    $holder: (type === 'GIFs') ? '#gifHolder' : '#btnHolder',
                    arry: (type === 'GIFs') ? self.gifArray : self.btnArray,
                },
                count = 0;
            
            $(config.$holder).empty();

            $.each(config.arry, function(index,value)
            {
                count ++;
                html += self.getHTML(value, count, type);
                if (count === ((type === 'GIFs') ? 4 : 3) || index === (config.arry.length - 1))
                {
                    $(config.$holder).append(html);
                    html = '';
                    count = 0;
                }
            });
        },
        startUp: function()
        {
            var self = this;

            self.getLocalData('btnArray');
            self.getLocalData('slctdBtn');
            self.callAPI(self.slctdBtn);
        }
    }

    $(document.body).on("click", "img", function() 
    {
        var state = $(this).attr("data-state");
        if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
        } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
        }
    });
    
    $(document.body).on("click", ".gifBtn", function() 
    {
        
        gifApp.gifBtnClick(this.innerHTML.trim());
    });
    
    $(document.body).on("click", ".deleteBtn", function() 
    {
        gifApp.removeBtn($(this).attr("data-btn"));
    });

    $('#newBtn').on("click", function() 
    {
        var usrInput = $('#newBtnName').val().trim().toLowerCase();
        if (usrInput != '') gifApp.addBtn(usrInput);
        $('#newBtnName').val('');
    });

    gifApp.startUp();

})