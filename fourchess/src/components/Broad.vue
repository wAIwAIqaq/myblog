<template>
  <div>
    <div>
      <title class="gameTitle">四子棋</title>
      <transition name="el-zoom-in-center">
        <div v-show="isRed" class="redDrop">请红方落子</div>
      </transition>
      <transition name="el-zoom-in-center">
        <div v-show="!isRed" class="redDrop orangeDrop">请橙方落子</div>
      </transition>
    </div>
    <div class="board" ref="board">
      <span class="redCount">红方:{{ redCount }}</span>
      <span class="orangeCount">{{ orangeCount }}:橙方</span>
      <div class="board-main">
        <div class="" v-for="item in boardArr" :key="item.cid">
          <div
            :class="chessBoxPosition(item.xid, item.yid)"
            @click="handleChess(item.xid, item.yid)"
          >
            <div>
              <transition name="el-zoom-in-center">
                <div v-show="item.isShow" class="transition-box">
                  <i ref="chessItem" class="el-icon-apple activeChess"></i>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      boardSize: 10,
      isRed: true,
      chessActionArr: [],
      boardArr: [],
      redCount: 0,
      orangeCount: 0,
    };
  },
  created() {
    const boardSize = this.boardSize;
    this.createChessBoard(boardSize);
  },
  methods: {
    handleChess(x, y) {
      const isRed = this.isRed;
      if (
        this.boardArr[x * 10 + y].isRed === true ||
        this.boardArr[x * 10 + y].isRed === false
      ) {
        this.$notify.error({
          title: "此格子已有子",
          message: "请在空余的格子内下子",
        });
      } else {
        this.chessActionArr.push([x, y]);
        this.boardArr[x * 10 + y].isRed = isRed;
        this.boardArr[x * 10 + y].isShow = true;
        this.$refs.chessItem[x * 10 + y].style.color = isRed ? "red" : "orange";
        this.$refs.chessItem[x * 10 + y].className = isRed
          ? "el-icon-apple activeChess"
          : "el-icon-pear activeChess";
        this.$refs.board.style.backgroundColor = isRed ? "#e6a23c" : "#f56c6c";
        this.endValidate(x, y, isRed, 0, 1);
        this.endValidate(x, y, isRed, 1, 0);
        this.endValidate(x, y, isRed, 1, -1);
        this.endValidate(x, y, isRed, 1, 1);
        this.isRed = !isRed;
      }
    },
    createChessBoard(boardSize) {
      let cid = 0;
      const boardArr = [];
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          boardArr.push({ cid: cid, xid: i, yid: j, isShow: false });
          cid++;
        }
      }
      this.boardArr = boardArr;
    },
    chessBoxPosition(x, y) {
      if (x === 9) {
        if (y === 9) {
          return "chessBoxItem  chessBoxItem-X chessBoxItem-Y";
        }
        return "chessBoxItem chessBoxItem-X";
      }
      if (y === 9) {
        return "chessBoxItem chessBoxItem-Y";
      }
      return "chessBoxItem";
    },
    endValidate(x, y, isRed, a, b) {
      let linkChessCount = 1;
      for (let i = 1; i < 4; i++) {
        if (
          this.boardArr[(x + a * i) * 10 + y - b * i] &&
          this.boardArr[(x + a * i) * 10 + y - b * i].isRed === isRed
        ) {
          linkChessCount++;
        } else {
          break;
        }
      }
      for (let i = 1; i < 4; i++) {
        if (
          this.boardArr[(x - a * i) * 10 + y + b * i] &&
          this.boardArr[(x - a * i) * 10 + y + b * i].isRed === isRed
        ) {
          linkChessCount++;
        } else {
          break;
        }
      }
      if (linkChessCount === 4) {
        this.$confirm("是否继续？", `${isRed ? "红方" : "橙方"}获胜`, {
          confirmButtonText: "继续",
          cancelButtonText: "悔棋",
          position: "bottom-right",
          type: `${isRed ? "error" : "warning"}`,
          center: true,
        })
          .then(() => {
            if (isRed) {
              this.redCount++;
              this.$message({
                type: "error",
                message: `红方获胜`,
                center: true,
              });
            } else {
              this.orangeCount++;
              this.$message({
                type: "warning",
                message: `橙方获胜`,
                center: true,
              });
            }
            this.boardReset();
          })
          .catch(() => {
            let [x1, y1] = this.chessActionArr[this.chessActionArr.length - 1];
            let [x2, y2] = this.chessActionArr[this.chessActionArr.length - 2];
            this.$nextTick(() => {
              this.boardArr[x1 * 10 + y1].isRed = null;
              this.boardArr[x1 * 10 + y1].isShow = !this.boardArr[x1 * 10 + y1]
                .isShow;
              this.boardArr[x2 * 10 + y2].isRed = null;
              this.boardArr[x2 * 10 + y2].isShow = !this.boardArr[x2 * 10 + y2]
                .isShow;
              this.$message({
                type: "success",
                message: `悔棋成功`,
                center: true,
              });
            });
          });
      }
    },
    boardReset() {
      this.isRed = true;
      this.boardArr.map((chessItem) => {
        chessItem.isRed = null;
      });
      this.$refs.board.style.backgroundColor = "#f56c6c";
      this.$refs.chessItem.map((chessItem) => {
        chessItem.style.color = "#fff";
      });
    },
  },
};
</script>

<style scoped>
.gameTitle {
  display: block;
  font-size: 30px;
}
.board {
  position: relative;
  top: 100px;
  left: 0;
  bottom: 0;
  width: 300px;
  height: 300px;
  margin: auto;
  border: 1px solid #000;
  border-radius: 10px;
  padding: 10px;
  font-size: 0;
  background-color: #f56c6c;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.4);
}
.board-main {
  position: absolute;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  top: 10px;
  left: 10px;
  bottom: 10px;
  right: 10px;
  background-color: #fff;
}
.chessBoxItem {
  box-sizing: border-box;
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 1px solid #000;
  border-bottom: 0;
  border-right: 0;
  cursor: pointer;
}
.chessBoxItem-X {
  border-right: 1px solid #000;
}
.chessBoxItem-Y {
  border-bottom: 1px solid #000;
}

.activeChess {
  font-size: 20px;
  line-height: 28px;
  text-align: center;
}
.redDrop {
  position: fixed;
  top: 120px;
  left: 0;
  right: 0;
  margin: auto;
  width: 150px;
  height: 50px;
  border-radius: 4px;
  background-color: #f56c6c;
  text-align: center;
  color: #fff;
  line-height: 50px;
  box-sizing: border-box;
}
.orangeDrop {
  background-color: #e6a23c;
}
.redCount,
.orangeCount {
  position: absolute;
  top: -65px;
  display: inline-block;
  font-size: 20px;
  color: #000;
}
.redCount {
  left: 0;
  color: #f56c6c;
}
.orangeCount {
  right: 0;
  color: #e6a23c;
}
</style>