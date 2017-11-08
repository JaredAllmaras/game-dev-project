class StatusBar extends Phaser.group
{
    constructuor(){
        super(game);
        this.bar = this.create(0,0,'statBar');
        
    }
    setPrecent(percent){
        percent = percent/100;
        this.bar.width = 300*percent;
        
        
    }
    
}