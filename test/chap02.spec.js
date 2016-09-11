"use strict";

// 第2章 なぜ関数型プログラミングが重要か
// ========

var expect = require('expect.js');

var compose = (f,g) => {
  return (arg) => {
    return f(g(arg));
  };
};

// ## 2.2 関数型プログラミングの特徴
describe('関数型プログラミングの特徴', () => {
  // ### ファーストクラスオブジェクトとしての関数
  describe('ファーストクラスオブジェクトとしての関数', () => {
    it('数値はファーストクラスオブジェクトである', (next) => {
      /*  #@range_begin(number_as_first_class_citizen) */
      // 値を変数にバインドする
      var zero = 0;
      var name = "Haskell Curry";
      // 値をデータ構造に埋めこむ
      var birthday = {
        year: 1999,
        month: 1,
        day: 12
      };
      // 関数から値を返す
      var birthYear = (birthdayObject) => {
        return birthdayObject.year;
      };
      /* #@range_end(number_as_first_class_citizen) */
      // 値を関数に渡す
      expect(
        Math.sqrt(1)
      ).to.eql(
        1
      );
      expect(
        birthYear(birthday)
      ).to.eql(
        1999
      );
      next();
    });
    it('関数は変数にバインドできる', (next) => {
      /* #@range_begin(function_bound_to_variable) */
      var succ = (n) => {
        return n + 1;
      };
      /* #@range_end(function_bound_to_variable) */
      expect(
        succ(1) // 変数succを用いてλ式を呼びだす
      ).to.eql(
        2
      );
      next();
    });
    it('関数をオブジェクトに埋めこむ', (next) => {
      /* #@range_begin(function_embedded_in_object) */
      var math = {
        add: (n,m) => {
          return n + m;
        }
      };
      expect(
        math.add(1,2)
      ).to.eql(
        3
      );
      /* #@range_end(function_embedded_in_object) */
      next();
    });
    // ### 高階関数
    describe('高階関数', () => {
      // forEach文によるsumの定義
      it('forEach文によるsumの定義', (next) => {
        /* #@range_begin(sum_forEach) */
        var sum = (array) => {
          var result = 0;
          array.forEach((item) => { // forEachに関数を渡す
            result = result + item;
          });
          return result;
        };
        /* #@range_end(sum_forEach)  */
        expect(
          sum([1,2,3,4])
        ).to.eql(
          10
        );
        next();
      });
      describe('関数を返す', () => {
        // adderを定義する
        it('adderを定義する', (next) => {
          /* #@range_begin(adder_definition) */
          var adder = (n) => {
            return (m) => { // 関数を返す
              return n + m;
            };
          };
          /* #@range_end(adder_definition) */
          var succ = adder(1);
          expect(
            succ(0)
          ).to.eql(
            1
          );
          next();
        });
      });
    });
  });
});
// ## 参照透過性
describe('参照透過性', () => {
  // ### 参照透明性が成立する場面
  describe('参照透明性が成立する場面', () => {
    // #### 値の参照透過性
    it('値の参照透過性', (next) => {
      /* #@range_begin(number_has_referential_transparency) */
      expect(
        2
      ).to.eql(
        2
      );
      /* #@range_end(number_has_referential_transparency) */
      next();
    });
    // #### 変数の参照透過性
    describe('変数の参照透明性', () => {
      it('変数が参照透明性を持つ場合', (next) => {
        /* #@range_begin(variable_is_referential_transparent) */
        var x = 1;
        expect(
          x 
        ).to.eql(
          x
        );
        var y = x;
        expect(
          y
        ).to.eql(
          1
        );
        /* #@range_end(variable_is_referential_transparent) */
        next();
      });
      it('変数は参照透明性を持つとは限らない', (next) => {
        /* #@range_begin(variable_isnt_referential_transparent) */
        var foo = 2;
        var bar = foo;
        foo = 3;
        expect(
          foo
        ).to.not.eql(
          bar
        );
        /* #@range_end(variable_isnt_referential_transparent) */
        next();
      });
    });
    // #### 関数の参照透過性
    describe('関数の参照透明性', () => {
      // succ関数は参照透明性を持つ
      it('succ関数は参照透明性を持つ', (next) => {
        var succ = (x) => {
          return x + 1;
        };
        // ~~~
        // node> succ(1) === succ(1)
        // true
        // ~~~
        expect(
          succ(1) === succ(1)
        ).to.eql(
          true
        );
        expect(
          succ(1) // 1回目の実行
        ).to.eql(
          2
        );
        expect(
          succ(1) // 2回目の実行
        ).to.eql(
          2
        );
        next();
      });
    });
  });
});
// ### 参照透過性を破壊するもの
describe('参照透過性を破壊するもの', () => {
  // 可変なデータは参照透明性を破壊する
  // ~~~
  // node> var array = [1];
  // node> array
  // [ 1 ]
  // node> array.push(2);
  // 2
  // node> array
  // [ 1, 2 ]
  // ~~~
  it('可変なデータは参照透明性を破壊する', (next) => {
    var array = [1];
    expect(
      array
    ).to.eql(
      [1]
    );
    array.push(2);
    expect(
      array
    ).to.eql(
      [1,2]
    );
    next();
  });
  // 代入操作は参照透明性を破壊する
  // ~~~
  // node> var one = 1;
  // node> var ichi = one;
  // node> ichi === one;
  // true
  // node> one = 2;
  // 2
  // node> ichi === one;
  // false
  // ~~~
  it('代入操作は参照透明性を破壊する', (next) => {
    /* #@range_begin(assignment_breaks_referential_transparency) */
    var x = 0;
    var add = (y) => {
      x = x + 1; // 代入で変数を更新する
      return x + y;
    };
    /* #@range_end(assignment_breaks_referential_transparency)  */
    expect(
      add(1)
    ).to.eql(
      2
    );
    next();
  });
  // 命令型な階乗関数
  it('命令型な階乗関数', (next) => {
    /* #@range_begin(imperative_factorial) */
    var factorial = (n) => {
      /* 変数resultに結果が入る */
      var result = 1;             
      /* 変数timesは反復の回数を数える */
      var times = 1;              
      /* while文は反復を処理する */
      while(times < n + 1) {      
        /* 変数resultを代入で更新する */
        result = result * times;  
        /* 変数timesを代入で更新する */
        times = times + 1;        
      }
      return result;
    };
    /* #@range_end(imperative_factorial) */
    expect(
      factorial(2)
    ).to.eql(
      2
    );
    expect(
      factorial(3)
    ).to.eql(
      6
    );
    expect(
      factorial(4)
    ).to.eql(
      24
    );
    next();
  });
});
// 副作用と入出力
describe('副作用と入出力', () => {
  it('ファイル入出力が参照透明性を破壊する例', (next) => {
    /* #@range_begin(fileio_breaks_referential_transparency)  */
    var fs = require('fs');
    var read = (path) => {
      var readValue = fs.readFileSync(path);
      return parseInt(readValue);
    };
    var write = (path, n) => {
      fs.writeFileSync(path, n);
      return n;
    };
    /* #@range_end(fileio_breaks_referential_transparency)  */
    write('test/resources/io.txt', 1);
    expect(
      read('test/resources/io.txt')
    ).to.eql(
      1
    );
    write('test/resources/io.txt', 2); // ここでファイルに値を書きこむ
    expect(
      read('test/resources/io.txt')
    ).to.eql(
      2
    );
    next();
  });
});
describe('副作用の種類', () => {
  describe('副作用としての代入', () => {
    it('配列は参照透明性を破壊する', (next) => {
      /* #@range_begin(array_destroys_referential_transparency) */
      var array = [];
      array.push(1);
      expect(
        array.pop()
      ).to.eql(
        1
      );
      array.push(2);
      expect(
        array.pop()
      ).to.eql(
        2
      );
      /* #@range_end(array_destroys_referential_transparency) */
      next();
    });
  });
});
// ### 参照透明性を保証する
describe('参照透明性を保証する', () => {
  // #### 値の参照透過性を保証する（可変なデータの排除）
  describe('値の参照透過性を保証する（可変なデータの排除）', () =>  {
    it('不変なデータ型', (next) => {
      /* #@range_begin(immutable_datatype) */
      var empty =  (_) => {
        return null;
      };
      var get = (key, obj) => {
        return obj(key);
      };
      var set = (key, value, obj) => {
        return (key2) => {
          if(key === key2) {
            return value;
          } else {
            return get(key2,obj);
          }
        };
      };
      /* #@range_end(immutable_datatype) */
      next();
    });
  });
  // #### 変数の参照透過性を保証する(代入の排除)
  describe('変数の参照透過性を保証する(代入の排除)', () => {
    it('命令型プログラミングによる乗算', (next) => {
      /* #@range_begin(imperative_addition) */
      var add = (x,y) => {
        var times = 0;          
        var result = x;         

        /* while文で反復を処理する */
        while(times < y){       
          result = result + 1;
          times = times + 1;    
        };
        return result;
      };
      /* #@range_end(imperative_addition) */
      expect(
        add(2,3)
      ).to.eql(
        5
      );
      var x = 4;
      var y = 5;
      expect(
        add(x,y)
      ).to.eql(
        9
      );
      expect(
        x
      ).to.eql(
        4
      );
      next();
    });
    it('関数型プログラミングによる乗算', (next) => {
      /* #@range_begin(functional_addition) */
      var add = (x,y) => {
        if(y < 1){
          return x;
        } else {
          /* 新しい引数でadd関数を再帰的に呼び出す */
          return add(x + 1, y - 1); 
        }
      };
      /* #@range_end(functional_addition) */
      expect(add(2,1)).to.eql(3);
      expect(add(2,2)).to.eql(4);
      expect(add(3,2)).to.eql(5);
      expect(add(12,5)).to.eql(17);
      next();
    });
  });
  // #### 関数の参照透過性を保証する（副作用の分離）
  describe('関数の参照透過性を保証する（副作用の分離）', () =>  {
    it('副作用が分離されていないコード', (next) => {
      /* #@range_begin(age_sideeffect) */
      var age = (birthYear) => {
        /* todayは現時点の日付データ */
        var today = new Date();
        /* getFullYear関数は日付データにもとづいて現時点の西暦を返す */
        var thisYear = today.getFullYear(); 
        return thisYear - birthYear;
      };
      /* #@range_end(age_sideeffect) */
      next();
    });
    it('副作用が分離されているコード', (next) => {
      /* #@range_begin(age_without_sideeffect) */
      var age = (birthYear, thisYear) => {
        return thisYear - birthYear;
      };
      /* #@range_end(age_without_sideeffect) */
      next();
    });
    it('画面出力を分離する', (next) => {
      /* #@range_begin(tap_console_log) */
      var tap = (target, sideEffect) => {
        sideEffect(target);
        return target;
      };
      var logger = (value) =>{
        console.log(value);
      };
      /* #@range_end(tap_console_log) */
      next();
    });
  });
});
// ## 関数型プログラミングの利点
describe('関数型プログラミングの利点', () => {
  // ### 高いモジュール性
  describe('モジュール性とは何か', () => {
    // #### 部品の独立性
    // #### 部品の汎用性
    describe('部品の汎用性', () => {
      describe('reduceによる反復処理の汎用化', () => {
        // forEachメソッドによるsumの定義
        it('forEachメソッドによるsumの定義', (next) => {
          /* #@range_begin(sum_in_array_while) */
          var sum = (array) => {
            /* 結果を格納する変数 */
            var result = 0;
            /* 反復した回数を格納する変数 */
            var index = 0; 
            while(index < array.length) {
              /* 変数resultを代入で更新する */
              result = result + array[index];
              /* 反復回数を更新する */
              index = index + 1;
            }
            return result;
          };
          /* #@range_end(sum_in_array_while)  */
          expect(
            sum([1,2,3,4])
          ).to.eql(
            10
          );
          expect(
            sum([1,2,3,4])
          ).to.eql(
            10
          );
          next();
        });
        // reduceメソッドによるsumの定義
        it('reduceメソッドによるsumの定義', (next) => {
          /* #@range_begin(sum_in_array_reduce) */
          var sum = (array) => {
            return array.reduce(/* 第1引数に関数を渡す */
              (accumulator, item) => { 
                return accumulator + item; /* 足し算を実行する */
              },0); // 第2引数には、蓄積変数の初期値として0を渡す 
          };
          /* #@range_end(sum_in_array_reduce)  */
          expect(
            sum([1,2,3,4])
          ).to.eql(
            10
          );
          next();
        });
        // product関数の定義
        it('product関数の定義', (next) => {
          /* #@range_begin(product_in_array_reduce) */
          var product = (array) => {
            return array.reduce((accumulator, item) => {
              return accumulator * item; /* かけ算を実行する */
            }, 1); // 第2引数には、蓄積変数の初期値として1を渡す 
          };
          /* #@range_end(product_in_array_reduce)  */
          /* #@range_begin(product_in_array_reduce_test) */
          expect(
            product([1,2,3,4])
          ).to.eql(
            24
          );
          /* #@range_end(product_in_array_reduce_test)  */
          next();
        });
        it('allの定義', (next) => {
          /* #@range_begin(all_in_array_reduce) */
          var all = (array) => {
            return array.reduce((accumulator, item) => {
              return accumulator && item; /* 論理和を実行する */
            }); /* 第2引数を指定していない場合は、
                   配列の先頭要素が変数accumulatorの初期値になる */
          };
          /* #@range_end(all_in_array_reduce)  */
          expect(
            all([true,true,true])
          ).to.eql(
            true
          );
          expect(
            /* #@range_begin(all_in_array_reduce_test) */
            all([true,false,true])
            /* #@range_end(all_in_array_reduce_test) */
          ).to.eql(
            /* #@range_begin(all_in_array_reduce_test_result) */
            false
            /* #@range_end(all_in_array_reduce_test_result) */
          );
          next();
        });
        it('maxの定義', (next) => {
          /* #@range_begin(max_in_array_reduce) */
          var max = (array) => {
            var bigger = (n,m) => {
              if(n > m) {
                return n;
              } else {
                return m;
              };
            };
            return array.reduce((accumulator, item) => {
              return bigger(accumulator, item);
            });
          };
          /* #@range_end(max_in_array_reduce)  */
          expect(
            max([1,2,3,4])
          ).to.eql(
            4
          );
          expect(
            max([1,-2,3,-4])
          ).to.eql(
            3
          );
          next();
        });
        it('reverseの定義', (next) => {
          /* #@range_begin(reverse_in_array_reduce) */
          var reverse = (array) => {
            return array.reduce((accumulator, currentValue) => {
              return [currentValue].concat(accumulator);
            },[]);
          };
          expect(reverse([1,2,3,4])).to.eql([4,3,2,1]);
          /* #@range_end(reverse_in_array_reduce)  */
          next();
        });
        // map関数の定義
        it('map関数の定義', (next) => {
          var succ = (n) => {
            return n + 1;
          };
          /* #@range_begin(map_in_array_reduce) */
          var map = (transform) => {
            return (array) => {
              return array.reduce((accumulator, item) => {
                return accumulator.concat(transform(item));
              },[]); // 蓄積変数の初期値として空の配列[]を指定する
            };
          };
          /* #@range_end(map_in_array_reduce)  */
          expect(
            map(succ)([1,2,3])
          ).to.eql(
            [2,3,4]
          );
          var constant = (any) => {
            return (_) => {
              return any;
            };
          };
          var alwaysOne = constant(1); 
          expect(
            /* #@range_begin(map_in_array_reduce_test) */
            map(succ)([1,3,5])
            /* #@range_end(map_in_array_reduce_test) */
          ).to.eql(
            /* #@range_begin(map_in_array_reduce_test_result) */
            [2,4,6]
            /* #@range_end(map_in_array_reduce_test_result) */
          );
          next();
        });
        it('reduceによるfilterの定義', (next) => {
          var even = (n) => {
            return n % 2 === 0;
          };
          /* #@range_begin(filter_in_array_reduce) */
          var filter = (array) => {
            return (predicate) => {
              return array.reduce((accumulator, item) => {
                if(predicate(item)) {
                  return accumulator.concat(item);
                } else {
                  return accumulator;
                }
              },[]); // 蓄積変数の初期値として空の配列[]を指定する
            };
          };
          /* #@range_end(filter_in_array_reduce)  */
          expect(
            filter([1,2,3])(even)
          ).to.eql(
            [2]
          );
          next();
        });
      });
    });
    // ### 部品を組み合わせる
    describe('部品を組み合わせる', () => {
      // #### 関数適用で部品を組み合わせる
      it('関数適用で部品を組み合わせる', (next) => {
        var map = (transform) => {
          return (array) => {
            return array.reduce((accumulator, item) => {
              return accumulator.concat(transform(item));
            },[]); // 蓄積変数の初期値として空の配列[]を指定する
          };
        };
        var sum = (array) => {
          return array.reduce((accumulator, item) => { // 第1引数に関数を渡す
            return accumulator + item;                 // 足し算を実行する
          },0); // 第2引数には、蓄積変数の初期値として0を渡す 
        };
        // constant関数
        /* #@range_begin(constant) */
        var constant = (any) => {
          return (_) => {
            return any;
          };
        };
        var alwaysOne = constant(1); 
        /* #@range_end(constant) */
        /* #@range_begin(map_alwaysOne) */
        expect(
          map(alwaysOne)([1,2,3])
        ).to.eql(
          [1,1,1]
        );
        /* #@range_end(map_alwaysOne) */
        var flip = (fun) => {
          return  (x) => {
            return (y) => {
              return fun(y)(x);
            };
          };
        };
        // 関数合成によるlength関数の定義
        /* #@range_begin(array_length_in_composition) */
        var length = (array) => { // 引数が配列であることを明示する
          return compose(sum,map(alwaysOne))(array);
        };
        /* #@range_end(array_length_in_composition)  */
        expect(
          length([1,2,3])
        ).to.eql(
          3
        );
        next();
      });
      it('adderからsucc関数を作る', (next) => {
        /* #@range_begin(succ_from_adder) */
        var adder = (m) => {
          return (n) => {
            return m + n;
          };
        };
        var succ = adder(1);
        /* #@range_end(succ_from_adder)  */
        expect(
          succ(1)
        ).to.eql(
          2
        );
        next();
      });
      it('length関数を作る', (next) => {
        var map = (transform) => {
          return (array) => {
            return array.reduce((accumulator, item) => {
              return accumulator.concat(transform(item));
            },[]); // 蓄積変数の初期値として空の配列[]を指定する
          };
        };
        var sum = (array) => {
          return array.reduce((accumulator, item) => { // 第1引数に関数を渡す
            return accumulator + item;                 // 足し算を実行する
          },0); // 第2引数には、蓄積変数の初期値として0を渡す 
        };
        var constant = (any) => {
          return (_) => {
            return any;
          };
        };
        var alwaysOne = constant(1); 
        /* #@range_begin(array_length) */
        var length = (array) => {
          return sum(map(alwaysOne)(array));
        };
        /* #@range_end(array_length)  */
        expect(
          length([1,2,3])
        ).to.eql(
          3
        );
        next();
      });
      // #### 関数合成による処理の合成
      describe('関数合成による処理の合成', () => {
        // compose関数の定義
        /* #@range_begin(function_compose) */
        var compose = (f,g) => {
          return (arg) => {
            return f(g(arg));
          };
        };
        /* #@range_end(function_compose)  */
        it('関数合成でlength関数を作る(ポイントフリー版)', (next) => {
          var map = (transform) => {
            return (array) => {
              return array.reduce((accumulator, item) => {
                return accumulator.concat(transform(item));
              },[]); // 蓄積変数の初期値として空の配列[]を指定する
            };
          };
          var sum = (array) => {
            return array.reduce((accumulator, item) => { // 第1引数に関数を渡す
              return accumulator + item;                 // 足し算を実行する
            },0); // 第2引数には、蓄積変数の初期値として0を渡す 
          };
          var constant = (any) => {
            return (_) => {
              return any;
            };
          };
          var alwaysOne = constant(1); 
          /* #@range_begin(flip_definition) */
          var flip = (fun) => {
            return  (x) => {
              return (y) => {
                return fun(y)(x);
              };
            };
          };
          /* #@range_end(flip_definition) */

          // 関数合成によるlength関数の定義（ポイントフリースタイル）
          /* #@range_begin(array_length_in_composition_with_point_free_style) */
          var length = compose(sum,map(alwaysOne));
          /* #@range_end(array_length_in_composition_with_point_free_style)  */
          expect(
            length([1,2,3])
          ).to.eql(
            3
          );
          next();
        });
      });
      // #### 関数による遅延評価
      describe('関数による遅延評価', () => {
        // #### 評価戦略の種類
        describe('評価戦略の種類', () => {
          var map = (transform) => {
            return (array) => {
              return array.reduce((accumulator, item) => {
                return accumulator.concat(transform(item));
              },[]); 
            };
          };
          var sum = (array) => {
            return array.reduce((accumulator, item) => { // 第1引数に関数を渡す
              return accumulator + item;                 // 足し算を実行する
            },0); 
          };
          var constant = (any) => {
            return (_) => {
              return any;
            };
          };
          var alwaysOne = constant(1); 
          var length = compose(sum,map(alwaysOne));
          expect(
            // 正格評価の例
            /* #@range_begin(strict_evaluation) */
            length([1,1+1])
            /* #@range_end(strict_evaluation) */
          ).to.eql(
            /* #@range_begin(strict_evaluation_result) */
            2
            /* #@range_end(strict_evaluation_result) */
          );
          expect(
            // 遅延評価の例
            /* #@range_begin(lazy_evaluation) */
            length([1,(_) => {
                         return 1+1; 
                   }])
            /* #@range_end(lazy_evaluation) */
          ).to.eql(
            /* #@range_begin(lazy_evaluation_result) */
            2
            /* #@range_end(lazy_evaluation_result) */
          );
        });
        // #### 遅延評価によるストリーム
        describe('遅延評価によるストリーム', () => {
          // ストリームの例
          it('ストリームの例', (next) => {
            /* #@range_begin(stream_example) */
            var aStream = [1, (_) => { // 後尾は無名関数で表現する
              return 2;
            }];
            /* #@range_end(stream_example) */
            expect(
              /* #@range_begin(stream_head) */
              aStream[0] // ストリームの先頭要素を取得する
              /* #@range_end(stream_head) */
            ).to.eql(
              /* #@range_begin(stream_head_result) */
              1
              /* #@range_end(stream_head_result) */
            );
            expect(
              /* #@range_begin(stream_tail) */
              aStream[1]() // 関数適用でストリームの後尾を取り出す
              /* #@range_end(stream_tail) */
            ).to.eql(
              /* #@range_begin(stream_tail_result) */
              2
              /* #@range_end(stream_tail_result) */
            );
            /* #@range_begin(stream_ones) */
            var ones = [1, (_) => {
              return ones;
            }];
            /* #@range_end(stream_ones) */
            expect(
              ones[0]
            ).to.eql(
              1
            );
            expect(
              ones[1]()[0]
            ).to.eql(
              1
            );
            next();
          });

          // 無限ストリームの例
          /* #@range_begin(stream_iterate) */
          var iterate = (init) => {  // 先頭の値を渡す
            return (step) => {       // 次の値との差を計算する関数を渡す
              return [init, (_) => { // ストリーム型を返す
                return iterate(step(init))(step);
              }];
            };
          };
          /* #@range_end(stream_iterate) */
          // 無限の偶数列
          var succ = (n) => {
            return n + 1;
          };
          /* #@range_begin(enumFrom_by_iterate) */
          var enumFrom = (n) => {
            return iterate(n)(succ);
          };
          // 自然数列を定義する
          var naturals = enumFrom(1);
          // 偶数列を定義する
          var twoStep = (n) => {
            return n + 2;
          };
          var evenStream = iterate(2)(twoStep);
          /* #@range_end(enumFrom_by_iterate) */
          // filter関数
          /* #@range_begin(stream_filter) */
          var filter = (predicate) => {
            return (aStream) => {
              /* ストリームの先頭要素を取り出す */
              var head = aStream[0];
              /* 先頭要素が条件に合致する場合 */
              if(predicate(head) === true) { 
                return [head, (_) => {
                  return filter(predicate)(aStream[1]());
                }];
              } else {                       
                /* 先頭要素が条件に合致しない場合 */
                return filter(predicate)(aStream[1]());
              }
            };
          };
          /* #@range_end(stream_filter) */
          var take = (n, astream) => {
            if(n === 1) {
              return astream[0];
            } else {
              return [astream[0]].concat(take(n-1, astream[1]()));
            }
          };
          var even = (n) => {
            var mod = (n,m) => {
              return n % m;
            };
            return mod(n,2) === 0;
          };
          expect(
            take(3,filter(even)(enumFrom(2)))
          ).to.eql(
            [2,4,6]
          );
          /* #@range_begin(oddStream_from_iterate) */
          var twoStep = (n) => {
            return n + 2;
          };
          var oddStream = iterate(1)(twoStep);
          /* #@range_end(oddStream_from_iterate) */
          expect(
            take(3,oddStream)
          ).to.eql(
            [1,3,5]
          );
          // 無限の整数列
          it('無限の整数列', (next) => {
            /* #@range_begin(enumFrom) */
            var enumFrom = (n) => {
              return [n, (_) => { // ストリームを返す
                return enumFrom(n + 1);
              }];
            };
            /* #@range_end(enumFrom) */
            next();
          });
          // 無限の偶数列を作る
          it('無限の偶数列を作る', (next) => {
            /* #@range_begin(evenStream) */
            var evenFrom = (n) => {
              return [n, (_) => {
                return evenFrom(n + 2);
              }];
            };
            var evenStream = evenFrom(2); 
            /* #@range_end(evenStream) */
            expect(
              take(3, evenStream)
            ).to.eql(
              [2,4,6]
            );
            next();
          });
          it('ストリームのフィルタリング', (next) => {
            var filter = (predicate) => {
              return (aStream) => {
                var head = aStream[0]; // ストリームの先頭要素を取り出す
                if(predicate(head) === true) { // 先頭要素headが条件に合致している場合
                  return [head, (_) => {
                    return filter(predicate)(aStream[1]());
                  }];
                } else {                       // 先頭要素headが条件に合致していない場合
                  return filter(predicate)(aStream[1]());
                }
              };
            };
            var multipleOf = (n) => {
              return (m) => {
                if((n % m) === 0) {
                  return true;
                } else {
                  return false;
                }
              };
            };
            /* #@range_begin(odd_stream) */
            var odd = (n) => {
              return (n % 2) === 1; 
            };
            var oddStream = filter(odd)(enumFrom(1));
            /* #@range_end(odd_stream) */
            // elemAt関数
            /* #@range_begin(stream_elemAt) */
            var elemAt = (n) => {
              return (aStream) => {
                if(n === 1) {
                  return aStream[0];
                } else {
                  return elemAt(n-1)(aStream[1]());
                };
              };
            };
            /* #@range_end(stream_elemAt) */
            expect(
              // 3番目の偶数を求める
              /* #@range_begin(third_element_of_odd_stream) */
              elemAt(3)(oddStream)
              /* #@range_end(third_element_of_odd_stream) */
            ).to.eql(
              /* #@range_begin(third_element_of_odd_stream_result) */
              5
              /* #@range_end(third_element_of_odd_stream_result) */
            );
            expect(
              take(5,filter(odd)(enumFrom(1)))
            ).to.eql(
              [ 1, 3, 5, 7, 9 ] 
            );
            // filter関数で無限の偶数列を作る
            /* #@range_begin(evenStream_by_filter) */
            var even = (n) => {
              return (n % 2) === 0; 
            };
            var evenStream = filter(even)(enumFrom(1));
            /* #@range_end(evenStream_by_filter) */
            expect(
              /* #@range_begin(third_element_of_evenStream) */
              elemAt(3)(evenStream)
              /* #@range_end(third_element_of_evenStream) */
            ).to.eql(
              /* #@range_begin(third_element_of_evenStream_result) */
              6
              /* #@range_end(third_element_of_evenStream_result) */
            );
            next();
          });
        });
        // 配列に対するelemAt関数
        it('配列に対するelemAt関数', (next) => {
          /* #@range_begin(array_elemAt) */
          var elemAt = (n) => {
            return (anArray) => {
              if(n === 1) {
                return anArray[0];
              } else {
                var tail = anArray.slice(1,anArray.length);
                return elemAt(n-1)(tail);
              };
            };
          };
          /* #@range_end(array_elemAt) */
          expect(
            /* #@range_begin(third_element_of_evenArray) */
            elemAt(3)([2,4,6])
            /* #@range_end(third_element_of_evenArray) */
          ).to.eql(
            /* #@range_begin(third_element_of_eventArray_result) */
            6
            /* #@range_end(third_element_of_eventArray_result) */
          );
          expect(
            // 4番目の偶数を求める
            /* #@range_begin(fourth_element_of_evenArray) */
            elemAt(4)([2,4,6])
            /* #@range_end(fourth_element_of_evenArray) */
          ).to.eql(
            /* #@range_begin(fourth_element_of_evenArray_result) */
            undefined
            /* #@range_end(fourth_element_of_evenArray_result) */
          );
          next();
        });
      });
    });
  });
  // ### テストが容易である
  describe('テスト', () => {
    // 単体テストの書き方の例
    it('単体テストの書き方の例', (next) => {
      var succ = (n) => {
        return n + 1;
      };
      expect(
        succ(1) // テストしたい式を書く
      ).to.eql(
        2       // 期待する結果を書く
      );
      next();
    });
    it('参照透過性のあるコードはテストが容易である', (next) => {
      var adder = (m) => {
        return (n) => {
          return m + n;
        };
      };
      /* #@range_begin(adder_test) */
      expect(
        adder(1)(2)
      ).to.eql(
        3
      );
      /* #@range_end(adder_test) */
      next();
    });
    describe('参照透過性のないコードはテストが困難である', () => {
      describe('ゲームの勝敗の例', () => {
        // 参照透過性のないコードのテスト
        it("参照透過性のないコードのテスト", (next) => {
          /* #@range_begin(winner_with_sideeffect) */
          var winner = (playerL, playerR) => {
            if(playerR.score > playerL.score) {
              console.log(playerR.name + "が勝者です");
            } else if(playerR.score < playerL.score) {
              console.log(playerL.name + "が勝者です");
            } else {
              console.log("引き分けです");
            }
          }; 
          /* #@range_end(winner_with_sideeffect) */
          var playerA = {
            name: 'a',
            score: 10
          };
          var playerB = {
            name: 'b',
            score: 20
          };
          next();
        });
        // winner関数の分離
        it("winner関数の分離", (next) => {
          /* #@range_begin(winner_without_sideeffect) */
          /* 勝者を判定する */
          var judge = (playerL, playerR) => {
            if(playerL.score > playerR.score) {
              return playerL;
            } else if(playerL.score < playerR.score) {
              return playerR;
            } else {
              return null;
            }
          }; 
          /* 勝者を告げる文字列を生成する */
          var announce = (winner) => {
            if(winner) {
              return winner.name + "が勝者です";
            } else {
              return "引き分けです";
            }
          };
          /* 勝者を表示する */
          var displayWinner = (winner) => {
            console.log(announce(winner));
          };
          /* #@range_end(winner_without_sideeffect) */
          // 副作用のない関数のテスト
          /* #@range_begin(announce_winner) */
          var socrates = {
            name: 'ソクラテス',
            score: 10
          };
          var plato = {
            name: 'プラトン',
            score: 20
          };
          /* 純粋な関数をテストする */
          expect(
            announce(judge(socrates, plato))
          ).to.eql(
            "プラトンが勝者です"
          );
          /* #@range_end(announce_winner) */
          next();
        });
      });
    });
  });
  // ### コードの正しさを証明できる
  describe('コードの正しさを証明できる', () => {
    // #### プロパティテストで正しさを検証する
    describe('プロパティテストで正しさを検証する', () => {
      var adder = (m) => {
        return (n) => {
          return m + n;
        };
      };
      var succ = adder(1);
      var iterate = (step) => {
        return (init) => {
          return [init, (_) => {
            return iterate(step)(step(init));
          }];
        };
      };
      var take = (n) => {
        return (aStream) => {
          if(n === 0) {
            return [];
          } else {
            return [aStream[0]].concat(take(n-1)(aStream[1]()));
          }
        };
      };
      var enumFrom = (from) => {
        return iterate(succ)(from);
      };
      var filter = (predicate) => {
        return (aStream) => {
          var head = aStream[0];
          if(predicate(head) === true) {
            return [head, (_) => {
              return filter(predicate)(aStream[1]());
            }];
          } else {
            return filter(predicate)(aStream[1]());
          }
        };
      };
      it('succ関数の性質テスト', (next) => {
        var elemAt = (n) => {
          return (aStream) => {
            if(n === 1) {
              return aStream[0];
            } else {
              return elemAt(n-1)(aStream[1]());
            };
          };
        };
        var scanl = (aStream) => {
          return (glue) => {
            var out = [aStream[0], (_) => {
              return zipWith(glue)(aStream[1](), out);
            }];
            return out;
          };
        };
        var conjunction = (x,y) => {
          return x && y;  // 論理和をとる
        };
        var zipWith = (glue) => {
          return (xs, ys) => {
            if(xs.length === 0) {
              return []; 
            } 
            if(ys.length === 0) {
              return []; 
            } 
            return [glue(xs[0], ys[0]), (_) => {
              return zipWith(glue)(xs[1](), ys[1]());
            }];
          };
        };
        var listAnd = (aStream) => {
          var out = [aStream[0], (_) => {
            return zipWith((x,y) => { 
              return x && y;
            })(aStream[1](), out);
          }];
          return out;
        };
        // プロパティテストのための関数
        /* #@range_begin(succ_property) */
        /* ストリームのmap関数 */
        var map = (transform) => {
          return (aStream) => {
            var head = aStream[0];
            return [transform(head), (_) => {
              return map(transform)(aStream[1]());
            }];
          };
        };
        /* ストリームの先頭から引数n分だけ取り出すtake関数 */
        var take = (n) => {
          return (aStream) => {
            if(n === 0) {
              return null;
            } else {
              return [aStream[0], (_) => {
                return take(n-1)(aStream[1]());
              }];
            }
          };
        };
        /* ストリームの全ての要素がtrueであるかを判定するall関数 */
        var all = (aStream) => {
          var allHelper = (aStream, accumulator) => {
            var head = aStream[0];
            var newAccumulator = accumulator && head;
            if(aStream[1]() === null){
              return newAccumulator;
            } else {
              return allHelper(aStream[1](), newAccumulator);
            } 
          };
          return allHelper(aStream, true);
        };
        /* 検証の対象となる命題 */
        var proposition = (n) => {
          return succ(0) + succ(n) === succ(succ(n));
        };
        /* #@range_end(succ_property) */
        // succ関数のプロパティテスト
        /* #@range_begin(succ_property_test) */
        /* 100個の整数について命題が正しいかをテストする */
        expect(
          all(
            take(100)(
              map(proposition)(enumFrom(0))
            )
          )
        ).to.eql(
          true
        );
        /* #@range_end(succ_property_test) */
        next();
      });
    });
  });
  // [目次に戻る](http://akimichi.github.io/functionaljs/) [次章に移る](http://akimichi.github.io/functionaljs/chap03.spec.html) 
});
