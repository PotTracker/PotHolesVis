/**
 * Created by sunny on 12/4/2015.
 */
function InformationBox(){
    var self = this;
}

InformationBox.prototype.display = function(_data){
    $("#displayBox").html(_data);
}