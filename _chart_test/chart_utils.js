// 'use strict';

const bulletinNum = []; // 게시글 post_id를 담을 배열

// 게시글 정보를 가져와서 bulletinNum 배열에 담기
for (let i = 0; i < post_id.length; i++) {
    bulletinNum.push(post_id[i].POST_ID);
}

// ejs 템플릿 렌더링 시 변수 전달
res.render('템플릿파일', { bulletinNum: bulletinNum });


const colors = ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'];
window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

(function(global) {
    var bulletin = [
        '공지사항1',
        'Walkers',
        'Running',
        'Slip-on',
        'Hiking_bulletin'
        ];

    var Samples = global.Samples || (global.Samples = {});

    Samples.utils = {
        // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
        srand: function(seed) {
            this._seed = seed;
        },

        rand: function(min, max) {
            var seed = this._seed;
            min = min === undefined ? 0 : min;
            max = max === undefined ? 1 : max;
            this._seed = (seed * 9301 + 49297) % 233280;
            return min + (this._seed / 233280) * (max - min);
        },
        numbers: function(config) {
            var cfg = config || {};
            var min = cfg.min || 0;
            var max = cfg.max || 1;
            var from = cfg.from || [];
            var count = cfg.count || 8;
            var decimals = cfg.decimals || 8;
            var continuity = cfg.continuity || 1;
            var dfactor = Math.pow(10, decimals) || 0;
            var data = [];
            var i, value;

            for (i = 0; i < count; ++i) {
                value = (from[i] || 0) + this.rand(min, max);
                if (this.rand() <= continuity) {
                    data.push(Math.round(dfactor * value) / dfactor);
                } else {
                    data.push(null);
                }
            }

            return data;
        },

        bulletin: function(config) {
            var cfg = config || {};
            var count = cfg.count || 8;
            var section = cfg.section;
            var values = [];
            var i, value;

            for (i = 0; i < count; ++i) {
                value = bulletin[Math.ceil(i) % 8];
                values.push(value.substring(0, section));
            }

            return values;
        },
        color: function(index) {
            return COLORS[index % COLORS.length];
        },

        transparentize: function (r, g, b, alpha) {
            const a = (1 - alpha) * 255;
            const calc = x => Math.round((x - a)/alpha);

            return `rgba(${calc(r)}, ${calc(g)}, ${calc(b)}, ${alpha})`;
        }


    };

    // INITIALIZATION
    Samples.utils.srand(Date.now());

}(this));