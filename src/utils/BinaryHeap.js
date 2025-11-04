export class BinaryHeap {
  constructor(compareFunction) {
    this.heap = []
    this.compare = compareFunction
    this.positionMap = new Map() // 记录元素在堆中的位置
  }

  size() {
    return this.heap.length
  }

  isEmpty() {
    return this.size() === 0
  }

  push(value) {
    const index = this.heap.length
    this.heap.push(value)
    this.positionMap.set(value.key, index)
    this.siftUp(index) //防止结构被破坏
  }

  pop() {
    if (this.isEmpty()) {
      return undefined
    }

    this.swap(0, this.heap.length - 1)
    const value = this.heap.pop()
    this.positionMap.delete(value.key)

    if (!this.isEmpty()) {
      this.siftDown(0)
    }
    return value
  }

  peek() {
    return this.isEmpty() ? undefined : this.heap[0]
  }

  // 更新节点的值
  update(key, newValue) {
    const index = this.positionMap.get(key)
    if (index === undefined) {
      return false
    }

    const oldNode = this.heap[index]
    // 更新节点的所有可比较字段
    Object.assign(oldNode, newValue)

    // 重新调整堆
    if (index > 0 && this.compare(this.heap[index], this.heap[this.parentIndex(index)]) < 0) {
      this.siftUp(index)
    } else {
      this.siftDown(index)
    }
    return true
  }

  has(key) {
    return this.positionMap.has(key)
  }

  parentIndex(index) {
    return Math.floor((index - 1) / 2)
  }

  leftChildIndex(index) {
    return 2 * index + 1
  }

  rightChildIndex(index) {
    return 2 * index + 2
  }

  swap(i, j) {
    const nodeI = this.heap[i]
    const nodeJ = this.heap[j]

    // 交换堆中元素
    this.heap[i] = nodeJ
    this.heap[j] = nodeI

    // 更新位置映射
    this.positionMap.set(nodeI.key, j)
    this.positionMap.set(nodeJ.key, i)
  }

  siftUp(index) {
    while (index > 0) {
      const parentIndex = this.parentIndex(index)
      if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) {
        break
      }
      this.swap(index, parentIndex)
      index = parentIndex
    }
  }

  siftDown(index) {
    while (true) {
      let minIndex = index
      const leftIndex = this.leftChildIndex(index)
      const rightIndex = this.rightChildIndex(index)

      if (
        leftIndex < this.heap.length &&
        this.compare(this.heap[leftIndex], this.heap[minIndex]) < 0
      ) {
        minIndex = leftIndex
      }

      if (
        rightIndex < this.heap.length &&
        this.compare(this.heap[rightIndex], this.heap[minIndex]) < 0
      ) {
        minIndex = rightIndex
      }

      if (minIndex === index) {
        break
      }

      this.swap(index, minIndex)
      index = minIndex
    }
  }
}
