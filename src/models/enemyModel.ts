export class enemyModel {
    public head:number;
    public body = new Array(5);
    public column:number;
    constructor(column:number){
        this.head = 0;
        this.column = column;
        this.body[0] = column+1;
        this.body[1] = column-1;
        this.body[2] = column;
        this.body[3] = column+1;
        this.body[4] = column-1;
    }
}