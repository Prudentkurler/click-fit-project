const $ = window.jQuery;

export function initJqueryInteractions(){

    setTimeout(()=> {
        $('#pageLoader').addClass('is-hidden')},450);
    $('#currentYear').text(new Date().getFullYear());
    
    
}