console.clear();

document.addEventListener('DOMContentLoaded',function(){
    controller.transmitter();
});

let controller =
{
    transmitter: function()
    {
        this.inputDisableCatalog();
        this.sliderInit();
        this.switchTabs();
        this.popup();
        this.filterField();
        this.calcPercentCard();
        this.slidAnchorLinks();
        this.actionButtonBanner();
        this.navigationActiveLink();
        this.modalSend();
    },
    inputDisableCatalog: function()
    {
        const catalogInput = $('.catalog input[data-active="false"]');
        [].forEach.call(catalogInput, function(e){
            e.disabled = true;
        });
    },
    sliderInit: function()
    {
        const swiper = new Swiper('.swiper',
        {
            direction: 'horizontal',
            slidesPerView: 'auto',
            spaceBetween: 0,
        });
    },
    switchTabs: function()
    {
        const catalogTabButton    = $(".catalog-tab button");
        const catalogTabPage      = $(".catalog-content div[class*=catalog-page]");
        switchStateBattonTabs(catalogTabButton);

        function switchStatePage(pageList,dataPage)
        {
            [].forEach.call(pageList,function(e){
                $(e).removeClass('active');
            });
            let pageName = ".catalog-page-" + dataPage;
            $(pageName).addClass('active');
            console.log(pageName,$(pageName));

        }
        function switchStateBattonTabs(el)
        {
            [].forEach.call(el,function(e){
                $(e).click(function(){
                    [].forEach.call(el,function(e){
                        $(e).removeClass('active');
                    });
                    $(this).addClass('active');
                    let pageActive = getDataPageActivButton(catalogTabButton);
                    switchStatePage(catalogTabPage,pageActive);
                });
            });
        }
        function getDataPageActivButton(el)
        {
            let pageActive = "";
            [].forEach.call(el,function(e){
                let activeClass = $(e).hasClass('active');
                if(activeClass){
                    pageActive = $(e).data('page');
                }
            });
            return pageActive;
        }
        //менять состояние active page
    },
    popup: function()
    {
        const buttonCall = $('button[data-toggle="modal"]');
        const modal = $('.modal');
        const modalDialog = $('.modal-dialog');
        const close = $(".close");

        openModal(buttonCall);
        closeModal(close);
        closeModal(modal);

        function openModal(el)
        {
            el.on('click',function()
            {
                let parrentEl = relevatClassEl(this,'catalog-card');
                let dataForModal = getContentmodal(parrentEl);
                setContentmodal(dataForModal);

                createLayer();
                modal.addClass('show');
                setTimeout(()=>{
                    modalDialog.addClass('show');
                },25)
            });
        }
        function closeModal(el)
        {
            el.on('click',function(){
                // console.log(event.target,'event.target')
                const _hasClassModal = $(event.target).hasClass('modal');
                const _hasClassClose = $(event.target).hasClass('close');
                if( _hasClassModal || _hasClassClose ){
                    const backdrop = $('.modal-backdrop');
                    modalDialog.removeClass('show');
                    setTimeout(()=>{
                        modal.removeClass('show');
                        backdrop.remove();
                    },250)
                }
            });
        }
        function createLayer()
        {
            const layer = '<div class="modal-backdrop"></div>';
            $('body').append(layer);
        }
        function getContentmodal(el)
        {
            const arrSumData = {
                'imgSrc': $(el).find('img').attr('src'),
                'caption': $(el).find('.caption h3').text(),
                'sizeArr': getSizeArr(el),
                'price': $($(el).find('.price')).clone(),
                'color': $(el).find('.color input:checked').val(),
                'inputCheckedSize': $(el).find('.size input:checked').val()
            };

            function getSizeArr(el)
            {
                const size      = $(el).find('.size input[data-active="true"]');
                const sizeArr   = new Array();
                [].forEach.call(size, function(e){
                    sizeArr.push(e.value);
                });
                return sizeArr;
            }

            return arrSumData;
        }
        function setContentmodal(arrData)
        {
            let arrSumData = {
                'imgSrc':  $('.modal-dialog .modal-img img'),
                'caption': $('.modal-dialog .caption span.h3'),
                'sizeArr': $('.modal-dialog .select-size'),
                'price':   $('.modal-dialog .catalog.modal-price'),
                'color':   $('.modal-dialog input[name="color"]')
            };

            for ( val in arrData ){

                let tempSumData = arrSumData[val];
                let tempArrData = arrData[val];
                console.log(tempSumData,'\n',tempArrData);
                switch (val) {
                    case 'imgSrc': tempSumData.attr('src',tempArrData); break;
                    case 'caption':
                        tempSumData.text(tempArrData);
                        $('.modal-dialog input[name="caption"]').val(tempArrData);
                        break;
                    case 'sizeArr': tempSumData.html(setSize(tempArrData)); break;
                    case 'price':
                        tempSumData.html(tempArrData);
                        const number = tempArrData.find('.price-current span').text();
                        $('input[name="price"]').val(number);
                        break;
                    case 'inputCheckedSize': $(`.modal-dialog .select-size option[value=${tempArrData}]`).attr('selected','selected'); break;
                    case 'color':
                        tempSumData.val(tempArrData);
                        $('input[name="color"]').val(tempArrData);
                        break;
                    default:
                        alert('console');
                        console.info('Видишь это сообщение?!\nПрошли мимо case перед выводом ');
                    break;
                }
            }
        }

        function setSize(el){
            let listOption = ``;
            console.log(el);
            el.forEach(function(e){
                listOption += `<option value="${e}">${e}</option>`;
            });
            return listOption;
        }
        function relevatClassEl(el,targetClassName,depth = 100){
            let correntParrent,currentClassName, tagNameEl,counter = 0;
            l1: do{
                counter ++;
                if(correntParrent){correntParrent = $(correntParrent).parent();}else{correntParrent = $(el).parent();}
                currentClassName = correntParrent.attr('class');

                tagNameEl =  $(correntParrent).prop("tagName").toLowerCase();
                if(tagNameEl == 'body')break l1;
                if(depth == counter || depth == false)break l1;
                if(targetClassName == currentClassName)break l1;

            }while(true);
            return correntParrent;
        };
        //вставить контент
    },
    filterField: function ()
    {
        let userName = $('.modal-dialog input[name="user-name"]');
        let userPhone = $('.modal-dialog input[name="user-phone"]');

        userPhone.on('input',function()
        {
            let val = this.value;
            const maxLength = 11;
            if(val.length < maxLength){
                this.value = val.replace (/\D/, '');
            }else{
                this.value = val.slice(0,10);
            }

        });
        userName.on('input',function()
        {
            let val = this.value;
                this.value = val.replace (/\d/, '');

        });
    },
    calcPercentCard: function()
    {
        const catalogCard = $('.catalog .catalog-card');

        [].forEach.call(catalogCard, function(e)
        {
            let priceOld = $(e).find('.price-old span').text();
            let priceCurrent = $(e).find('.price-current span').text();
            let percent = (((priceCurrent/priceOld)*100)-100).toFixed(0);
            let sall = $(e).find('.sall span').text(`${percent}%`);
        });
    },
    slidAnchorLinks: function()
    {
        $("header").on("click","a", function (event) {
            event.preventDefault();
            var id  = $(this).attr('href'),
                top = $(id).offset().top;
            $('body,html').animate({scrollTop: top-70}, 1500);
        });
    },
    actionButtonBanner: function()
    {
        const casual = 'casual';
        const erotic = 'erotic';
        action(casual);
        action(erotic);

        function action(beltType){
            const button = $(`button[data-type-belt="${beltType}"]`);
            button.on('click',function()
            {
                const navigationLink = $('a[href="#catalog"]');
                const buttonTab = $(`.catalog button[belt-type="${beltType}"]`);
                navigationLink.trigger('click');
                buttonTab.trigger('click');
            });
        }

    },
    navigationActiveLink:function()
    {
        const navbarNav =$('#navbarNav a');
        [].forEach.call(navbarNav,function(e){
            $(e).click(function(){
                [].forEach.call(navbarNav,function(e){
                    $(e).removeClass('active');
                });
                $(this).addClass('active');
            });
        });
    },
    modalSend: function()
    {
        const modalForm = document.getElementById('modal-form');
        const inputSubmit = document.querySelector('#modal-form input[type="submit"]');

        inputSubmit.onclick = function(event){
            event.preventDefault();
            let allField = modalForm.querySelectorAll('input');
            if(fieldValidation(allField)){
                sendData(modalForm);
            }

        };
        function userClick(el) {
            const event = new Event('click');
            el.dispatchEvent(event);
        }
        function sendData(el)
        {
            const xhr = new XMLHttpRequest();
            const form = new FormData(el);
            const modal = document.querySelector('.modal');
            xhr.open('POST', './i.php', true);
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.send(form);
            xhr.onload = function()
            {
                if (xhr.status !== 200) {
                    console.log( xhr.status + ': ' + xhr.statusText );
                    alert('xhr нормально без сервера не отправляется');
                } else {
                    console.log( xhr.responseText, xhr.status );
                    alert('форма успешно отправлена');
                    userClick(modal);
                    clearField('.modal input[name="user-name"]');
                    clearField('.modal input[name="user-phone"]');
                }
            };
        }
        function clearField(el)
        {
            document.querySelector(el).value = '';
        }
        function fieldValidation(field)
        {
            for (let element of field) {
                if(!element.value.length){
                    element.classList.add("err-field");//ошибка
                    return 0;
                }else{
                    if( element.classList.contains('err-field') )element.classList.remove('err-field');
                }
            }
            return 1;
        }
    }
}
