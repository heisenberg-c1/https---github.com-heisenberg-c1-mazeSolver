export class disjointSet {
    constructor(size) {
        this.parent = new Array(size);
        this.rank = new Array(size);
        for(let i = 0; i < size; i++) {
            this.parent[i] = i;
            this.rank[i] = 1;
        }
    }
    find(x) {
        if (this.parent[x] === x) {
            return this.parent[x];
        }
        //路径压缩
        return this.parent[x] = this.find(this.parent[x]);
    }

    isConnected(x, y) {
        return this.find(x) === this.find(y);
    }

    connect(x, y) {
        let xFather = this.find(x);
        let yFather = this.find(y);
        if (xFather === yFather) {
            return;
        }
        //按秩合并
        if (this.rank[xFather] < this.rank[yFather]) {
            this.parent[xFather] = yFather;
        } else if (this.rank[xFather] > this.rank[yFather]) {
            this.parent[yFather] = xFather;
        } else {
            this.parent[yFather] = xFather;
            this.rank[xFather]++;
        }
    }
}