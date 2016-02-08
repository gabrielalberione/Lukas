app.directive('onScroll', function() 
{
    return function(scope, elem, attr) 
    {
        //contenedor sobre el que debe actuar
        var $this = elem[0];
        //controlamos el evento scroll de este elemento
        elem.bind('scroll', function() 
        {
            //si el scroll llega al final ejecutamos la función 
            if ($this.scrollTop + $this.offsetHeight >= $this.scrollHeight) 
            {
                scope.$apply(attr.onScroll);
            }
        });
    }
});