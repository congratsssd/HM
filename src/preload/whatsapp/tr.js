export var tr = (function () {
    var e,
        t,
        n,
        r,
        i,
        o,
        a = [],
        s = a.concat,
        c = a.filter,
        l = a.slice,
        u = window.document,
        h = {},
        d = {},
        f = {
            'column-count': 1,
            columns: 1,
            'font-weight': 1,
            'line-height': 1,
            opacity: 1,
            'z-index': 1,
            zoom: 1
        },
        p = /^\s*<(\w+|!)[^>]*>/,
        m = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        y = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        g = /^(?:body|html)$/i,
        v = /([A-Z])/g,
        E = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],
        b = u.createElement('table'),
        w = u.createElement('tr'),
        O = {
            tr: u.createElement('tbody'),
            tbody: b,
            thead: b,
            tfoot: b,
            td: w,
            th: w,
            '*': u.createElement('div')
        },
        _ = /complete|loaded|interactive/,
        x = /^[\w-]*$/,
        S = {},
        L = S.toString,
        P = {},
        k = u.createElement('div'),
        G = {
            tabindex: 'tabIndex',
            readonly: 'readOnly',
            for: 'htmlFor',
            class: 'className',
            maxlength: 'maxLength',
            cellspacing: 'cellSpacing',
            cellpadding: 'cellPadding',
            rowspan: 'rowSpan',
            colspan: 'colSpan',
            usemap: 'useMap',
            frameborder: 'frameBorder',
            contenteditable: 'contentEditable'
        },
        T =
            Array.isArray ||
            function (e) {
                return e instanceof Array
            }

    function D(e) {
        return null == e ? String(e) : S[L.call(e)] || 'object'
    }

    function A(e) {
        return 'function' == D(e)
    }

    function C(e) {
        return null != e && e == e.window
    }

    function N(e) {
        return null != e && e.nodeType == e.DOCUMENT_NODE
    }

    function j(e) {
        return 'object' == D(e)
    }

    function I(e) {
        return j(e) && !C(e) && Object.getPrototypeOf(e) == Object.prototype
    }

    function R(e) {
        var t = !!e && 'length' in e && e.length,
            r = n.type(e)
        return (
            'function' != r &&
            !C(e) &&
            ('array' == r || 0 === t || ('number' == typeof t && t > 0 && t - 1 in e))
        )
    }

    function M(e) {
        return e
            .replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/_/g, '-')
            .toLowerCase()
    }

    function K(e) {
        return e in d ? d[e] : (d[e] = new RegExp('(^|\\s)' + e + '(\\s|$)'))
    }

    function B(e, t) {
        return 'number' != typeof t || f[M(e)] ? t : t + 'px'
    }

    function F(e) {
        return 'children' in e
            ? l.call(e.children)
            : n.map(e.childNodes, function (e) {
                  if (1 == e.nodeType) return e
              })
    }

    function q(e, t) {
        var n,
            r = e ? e.length : 0
        for (n = 0; n < r; n++) this[n] = e[n]
        ;(this.length = r), (this.selector = t || '')
    }

    function U(n, r, i) {
        for (t in r)
            i && (I(r[t]) || T(r[t]))
                ? (I(r[t]) && !I(n[t]) && (n[t] = {}),
                  T(r[t]) && !T(n[t]) && (n[t] = []),
                  U(n[t], r[t], i))
                : r[t] !== e && (n[t] = r[t])
    }

    function z(e, t) {
        return null == t ? n(e) : n(e).filter(t)
    }

    function $(e, t, n, r) {
        return A(t) ? t.call(e, n, r) : t
    }

    function W(e, t, n) {
        null == n ? e.removeAttribute(t) : e.setAttribute(t, n)
    }

    function H(t, n) {
        var r = t.className || '',
            i = r && r.baseVal !== e
        if (n === e) return i ? r.baseVal : r
        i ? (r.baseVal = n) : (t.className = n)
    }

    function V(e) {
        try {
            return e
                ? 'true' == e ||
                      ('false' != e &&
                          ('null' == e
                              ? null
                              : +e + '' == e
                              ? +e
                              : /^[\[\{]/.test(e)
                              ? n.parseJSON(e)
                              : e))
                : e
        } catch (t) {
            return e
        }
    }

    function Y(e, t) {
        t(e)
        for (var n = 0, r = e.childNodes.length; n < r; n++) Y(e.childNodes[n], t)
    }

    return (
        (P.matches = function (e, t) {
            if (!t || !e || 1 !== e.nodeType) return !1
            var n =
                e.matches ||
                e.webkitMatchesSelector ||
                e.mozMatchesSelector ||
                e.oMatchesSelector ||
                e.matchesSelector
            if (n) return n.call(e, t)
            var r,
                i = e.parentNode,
                o = !i
            return (
                o && (i = k).appendChild(e), (r = ~P.qsa(i, t).indexOf(e)), o && k.removeChild(e), r
            )
        }),
        (i = function (e) {
            return e.replace(/-+(.)?/g, function (e, t) {
                return t ? t.toUpperCase() : ''
            })
        }),
        (o = function (e) {
            return c.call(e, function (t, n) {
                return e.indexOf(t) == n
            })
        }),
        (P.fragment = function (t, r, i) {
            var o, a, s
            return (
                m.test(t) && (o = n(u.createElement(RegExp.$1))),
                o ||
                    (t.replace && (t = t.replace(y, '<$1></$2>')),
                    r === e && (r = p.test(t) && RegExp.$1),
                    r in O || (r = '*'),
                    ((s = O[r]).innerHTML = '' + t),
                    (o = n.each(l.call(s.childNodes), function () {
                        s.removeChild(this)
                    }))),
                I(i) &&
                    ((a = n(o)),
                    n.each(i, function (e, t) {
                        E.indexOf(e) > -1 ? a[e](t) : a.attr(e, t)
                    })),
                o
            )
        }),
        (P.Z = function (e, t) {
            return new q(e, t)
        }),
        (P.isZ = function (e) {
            return e instanceof P.Z
        }),
        (P.init = function (t, r) {
            var i, o
            if (!t) return P.Z()
            if ('string' == typeof t)
                if ('<' == (t = t.trim())[0] && p.test(t))
                    (i = P.fragment(t, RegExp.$1, r)), (t = null)
                else {
                    if (r !== e) return n(r).find(t)
                    i = P.qsa(u, t)
                }
            else {
                if (A(t)) return n(u).ready(t)
                if (P.isZ(t)) return t
                if (T(t))
                    (o = t),
                        (i = c.call(o, function (e) {
                            return null != e
                        }))
                else if (j(t)) (i = [t]), (t = null)
                else if (p.test(t)) (i = P.fragment(t.trim(), RegExp.$1, r)), (t = null)
                else {
                    if (r !== e) return n(r).find(t)
                    i = P.qsa(u, t)
                }
            }
            return P.Z(i, t)
        }),
        ((n = function (e, t) {
            return P.init(e, t)
        }).extend = function (e) {
            var t,
                n = l.call(arguments, 1)
            return (
                'boolean' == typeof e && ((t = e), (e = n.shift())),
                n.forEach(function (n) {
                    U(e, n, t)
                }),
                e
            )
        }),
        (P.qsa = function (e, t) {
            var n,
                r = '#' == t[0],
                i = !r && '.' == t[0],
                o = r || i ? t.slice(1) : t,
                a = x.test(o)
            return e.getElementById && a && r
                ? (n = e.getElementById(o))
                    ? [n]
                    : []
                : 1 !== e.nodeType && 9 !== e.nodeType && 11 !== e.nodeType
                ? []
                : l.call(
                      a && !r && e.getElementsByClassName
                          ? i
                              ? e.getElementsByClassName(o)
                              : e.getElementsByTagName(t)
                          : e.querySelectorAll(t)
                  )
        }),
        (n.contains =
            u.documentElement && u.documentElement.contains
                ? function (e, t) {
                      return e !== t && e.contains(t)
                  }
                : function (e, t) {
                      for (; t && (t = t.parentNode); ) if (t === e) return !0
                      return !1
                  }),
        (n.type = D),
        (n.isFunction = A),
        (n.isWindow = C),
        (n.isArray = T),
        (n.isPlainObject = I),
        (n.isEmptyObject = function (e) {
            var t
            for (t in e) return !1
            return !0
        }),
        (n.isNumeric = function (e) {
            var t = Number(e),
                n = typeof e
            return (
                (null != e &&
                    'boolean' != n &&
                    ('string' != n || e.length) &&
                    !isNaN(t) &&
                    isFinite(t)) ||
                !1
            )
        }),
        (n.inArray = function (e, t, n) {
            return a.indexOf.call(t, e, n)
        }),
        (n.camelCase = i),
        (n.trim = function (e) {
            return null == e ? '' : String.prototype.trim.call(e)
        }),
        (n.uuid = 0),
        (n.support = {}),
        (n.expr = {}),
        (n.noop = function () {}),
        (n.map = function (e, t) {
            var r,
                i,
                o,
                a,
                s = []
            if (R(e)) for (i = 0; i < e.length; i++) null != (r = t(e[i], i)) && s.push(r)
            else for (o in e) null != (r = t(e[o], o)) && s.push(r)
            return (a = s).length > 0 ? n.fn.concat.apply([], a) : a
        }),
        (n.each = function (e, t) {
            var n, r
            if (R(e)) {
                for (n = 0; n < e.length; n++) if (!1 === t.call(e[n], n, e[n])) return e
            } else for (r in e) if (!1 === t.call(e[r], r, e[r])) return e
            return e
        }),
        (n.grep = function (e, t) {
            return c.call(e, t)
        }),
        window.JSON && (n.parseJSON = JSON.parse),
        n.each(
            'Boolean Number String Function Array Date RegExp Object Error'.split(' '),
            function (e, t) {
                S['[object ' + t + ']'] = t.toLowerCase()
            }
        ),
        (n.fn = {
            constructor: P.Z,
            length: 0,
            forEach: a.forEach,
            reduce: a.reduce,
            push: a.push,
            sort: a.sort,
            splice: a.splice,
            indexOf: a.indexOf,
            concat: function () {
                var e,
                    t,
                    n = []
                for (e = 0; e < arguments.length; e++)
                    (t = arguments[e]), (n[e] = P.isZ(t) ? t.toArray() : t)
                return s.apply(P.isZ(this) ? this.toArray() : this, n)
            },
            map: function (e) {
                return n(
                    n.map(this, function (t, n) {
                        return e.call(t, n, t)
                    })
                )
            },
            slice: function () {
                return n(l.apply(this, arguments))
            },
            ready: function (e) {
                return (
                    _.test(u.readyState) && u.body
                        ? e(n)
                        : u.addEventListener(
                              'DOMContentLoaded',
                              function () {
                                  e(n)
                              },
                              !1
                          ),
                    this
                )
            },
            get: function (t) {
                return t === e ? l.call(this) : this[t >= 0 ? t : t + this.length]
            },
            toArray: function () {
                return this.get()
            },
            size: function () {
                return this.length
            },
            remove: function () {
                return this.each(function () {
                    null != this.parentNode && this.parentNode.removeChild(this)
                })
            },
            each: function (e) {
                return (
                    a.every.call(this, function (t, n) {
                        return !1 !== e.call(t, n, t)
                    }),
                    this
                )
            },
            filter: function (e) {
                return A(e)
                    ? this.not(this.not(e))
                    : n(
                          c.call(this, function (t) {
                              return P.matches(t, e)
                          })
                      )
            },
            add: function (e, t) {
                return n(o(this.concat(n(e, t))))
            },
            is: function (e) {
                return this.length > 0 && P.matches(this[0], e)
            },
            not: function (t) {
                var r = []
                if (A(t) && t.call !== e)
                    this.each(function (e) {
                        t.call(this, e) || r.push(this)
                    })
                else {
                    var i =
                        'string' == typeof t ? this.filter(t) : R(t) && A(t.item) ? l.call(t) : n(t)
                    this.forEach(function (e) {
                        i.indexOf(e) < 0 && r.push(e)
                    })
                }
                return n(r)
            },
            has: function (e) {
                return this.filter(function () {
                    return j(e) ? n.contains(this, e) : n(this).find(e).size()
                })
            },
            eq: function (e) {
                return -1 === e ? this.slice(e) : this.slice(e, +e + 1)
            },
            first: function () {
                var e = this[0]
                return e && !j(e) ? e : n(e)
            },
            last: function () {
                var e = this[this.length - 1]
                return e && !j(e) ? e : n(e)
            },
            find: function (e) {
                var t = this
                return e
                    ? 'object' == typeof e
                        ? n(e).filter(function () {
                              var e = this
                              return a.some.call(t, function (t) {
                                  return n.contains(t, e)
                              })
                          })
                        : 1 == this.length
                        ? n(P.qsa(this[0], e))
                        : this.map(function () {
                              return P.qsa(this, e)
                          })
                    : n()
            },
            closest: function (e, t) {
                var r = [],
                    i = 'object' == typeof e && n(e)
                return (
                    this.each(function (n, o) {
                        for (; o && !(i ? i.indexOf(o) >= 0 : P.matches(o, e)); )
                            o = o !== t && !N(o) && o.parentNode
                        o && r.indexOf(o) < 0 && r.push(o)
                    }),
                    n(r)
                )
            },
            parents: function (e) {
                for (var t = [], r = this; r.length > 0; )
                    r = n.map(r, function (e) {
                        if ((e = e.parentNode) && !N(e) && t.indexOf(e) < 0) return t.push(e), e
                    })
                return z(t, e)
            },
            parent: function (e) {
                return z(o(this.pluck('parentNode')), e)
            },
            children: function (e) {
                return z(
                    this.map(function () {
                        return F(this)
                    }),
                    e
                )
            },
            contents: function () {
                return this.map(function () {
                    return this.contentDocument || l.call(this.childNodes)
                })
            },
            siblings: function (e) {
                return z(
                    this.map(function (e, t) {
                        return c.call(F(t.parentNode), function (e) {
                            return e !== t
                        })
                    }),
                    e
                )
            },
            empty: function () {
                return this.each(function () {
                    this.innerHTML = ''
                })
            },
            pluck: function (e) {
                return n.map(this, function (t) {
                    return t[e]
                })
            },
            show: function () {
                return this.each(function () {
                    var e, t, n
                    'none' == this.style.display && (this.style.display = ''),
                        'none' == getComputedStyle(this, '').getPropertyValue('display') &&
                            (this.style.display =
                                ((e = this.nodeName),
                                h[e] ||
                                    ((t = u.createElement(e)),
                                    u.body.appendChild(t),
                                    (n = getComputedStyle(t, '').getPropertyValue('display')),
                                    t.parentNode.removeChild(t),
                                    'none' == n && (n = 'block'),
                                    (h[e] = n)),
                                h[e]))
                })
            },
            replaceWith: function (e) {
                return this.before(e).remove()
            },
            wrap: function (e) {
                var t = A(e)
                if (this[0] && !t)
                    var r = n(e).get(0),
                        i = r.parentNode || this.length > 1
                return this.each(function (o) {
                    n(this).wrapAll(t ? e.call(this, o) : i ? r.cloneNode(!0) : r)
                })
            },
            wrapAll: function (e) {
                if (this[0]) {
                    var t
                    for (n(this[0]).before((e = n(e))); (t = e.children()).length; ) e = t.first()
                    n(e).append(this)
                }
                return this
            },
            wrapInner: function (e) {
                var t = A(e)
                return this.each(function (r) {
                    var i = n(this),
                        o = i.contents(),
                        a = t ? e.call(this, r) : e
                    o.length ? o.wrapAll(a) : i.append(a)
                })
            },
            unwrap: function () {
                return (
                    this.parent().each(function () {
                        n(this).replaceWith(n(this).children())
                    }),
                    this
                )
            },
            clone: function () {
                return this.map(function () {
                    return this.cloneNode(!0)
                })
            },
            hide: function () {
                return this.css('display', 'none')
            },
            toggle: function (t) {
                return this.each(function () {
                    var r = n(this)
                    ;(t === e ? 'none' == r.css('display') : t) ? r.show() : r.hide()
                })
            },
            prev: function (e) {
                return n(this.pluck('previousElementSibling')).filter(e || '*')
            },
            next: function (e) {
                return n(this.pluck('nextElementSibling')).filter(e || '*')
            },
            html: function (e) {
                return 0 in arguments
                    ? this.each(function (t) {
                          var r = this.innerHTML
                          n(this)
                              .empty()
                              .append($(this, e, t, r))
                      })
                    : 0 in this
                    ? this[0].innerHTML
                    : null
            },
            text: function (e) {
                return 0 in arguments
                    ? this.each(function (t) {
                          var n = $(this, e, t, this.textContent)
                          this.textContent = null == n ? '' : '' + n
                      })
                    : 0 in this
                    ? this.pluck('textContent').join('')
                    : null
            },
            attr: function (n, r) {
                var i
                return 'string' != typeof n || 1 in arguments
                    ? this.each(function (e) {
                          if (1 === this.nodeType)
                              if (j(n)) for (t in n) W(this, t, n[t])
                              else W(this, n, $(this, r, e, this.getAttribute(n)))
                      })
                    : 0 in this && 1 == this[0].nodeType && null != (i = this[0].getAttribute(n))
                    ? i
                    : e
            },
            removeAttr: function (e) {
                return this.each(function () {
                    1 === this.nodeType &&
                        e.split(' ').forEach(function (e) {
                            W(this, e)
                        }, this)
                })
            },
            prop: function (e, t) {
                return (
                    (e = G[e] || e),
                    1 in arguments
                        ? this.each(function (n) {
                              this[e] = $(this, t, n, this[e])
                          })
                        : this[0] && this[0][e]
                )
            },
            removeProp: function (e) {
                return (
                    (e = G[e] || e),
                    this.each(function () {
                        delete this[e]
                    })
                )
            },
            data: function (t, n) {
                var r = 'data-' + t.replace(v, '-$1').toLowerCase(),
                    i = 1 in arguments ? this.attr(r, n) : this.attr(r)
                return null !== i ? V(i) : e
            },
            val: function (e) {
                return 0 in arguments
                    ? (null == e && (e = ''),
                      this.each(function (t) {
                          this.value = $(this, e, t, this.value)
                      }))
                    : this[0] &&
                          (this[0].multiple
                              ? n(this[0])
                                    .find('option')
                                    .filter(function () {
                                        return this.selected
                                    })
                                    .pluck('value')
                              : this[0].value)
            },
            offset: function (e) {
                if (e)
                    return this.each(function (t) {
                        var r = n(this),
                            i = $(this, e, t, r.offset()),
                            o = r.offsetParent().offset(),
                            a = { top: i.top - o.top, left: i.left - o.left }
                        'static' == r.css('position') && (a.position = 'relative'), r.css(a)
                    })
                if (!this.length) return null
                if (u.documentElement !== this[0] && !n.contains(u.documentElement, this[0]))
                    return {
                        top: 0,
                        left: 0
                    }
                var t = this[0].getBoundingClientRect()
                return {
                    left: t.left + window.pageXOffset,
                    top: t.top + window.pageYOffset,
                    width: Math.round(t.width),
                    height: Math.round(t.height)
                }
            },
            css: function (e, r) {
                if (arguments.length < 2) {
                    var o = this[0]
                    if ('string' == typeof e) {
                        if (!o) return
                        return o.style[i(e)] || getComputedStyle(o, '').getPropertyValue(e)
                    }
                    if (T(e)) {
                        if (!o) return
                        var a = {},
                            s = getComputedStyle(o, '')
                        return (
                            n.each(e, function (e, t) {
                                a[t] = o.style[i(t)] || s.getPropertyValue(t)
                            }),
                            a
                        )
                    }
                }
                var c = ''
                if ('string' == D(e))
                    r || 0 === r
                        ? (c = M(e) + ':' + B(e, r))
                        : this.each(function () {
                              this.style.removeProperty(M(e))
                          })
                else
                    for (t in e)
                        e[t] || 0 === e[t]
                            ? (c += M(t) + ':' + B(t, e[t]) + ';')
                            : this.each(function () {
                                  this.style.removeProperty(M(t))
                              })
                return this.each(function () {
                    this.style.cssText += ';' + c
                })
            },
            index: function (e) {
                return e ? this.indexOf(n(e)[0]) : this.parent().children().indexOf(this[0])
            },
            hasClass: function (e) {
                return (
                    !!e &&
                    a.some.call(
                        this,
                        function (e) {
                            return this.test(H(e))
                        },
                        K(e)
                    )
                )
            },
            addClass: function (e) {
                return e
                    ? this.each(function (t) {
                          if ('className' in this) {
                              r = []
                              var i = H(this)
                              $(this, e, t, i)
                                  .split(/\s+/g)
                                  .forEach(function (e) {
                                      n(this).hasClass(e) || r.push(e)
                                  }, this),
                                  r.length && H(this, i + (i ? ' ' : '') + r.join(' '))
                          }
                      })
                    : this
            },
            removeClass: function (t) {
                return this.each(function (n) {
                    if ('className' in this) {
                        if (t === e) return H(this, '')
                        ;(r = H(this)),
                            $(this, t, n, r)
                                .split(/\s+/g)
                                .forEach(function (e) {
                                    r = r.replace(K(e), ' ')
                                }),
                            H(this, r.trim())
                    }
                })
            },
            toggleClass: function (t, r) {
                return t
                    ? this.each(function (i) {
                          var o = n(this)
                          $(this, t, i, H(this))
                              .split(/\s+/g)
                              .forEach(function (t) {
                                  ;(r === e ? !o.hasClass(t) : r) ? o.addClass(t) : o.removeClass(t)
                              })
                      })
                    : this
            },
            scrollTop: function (t) {
                if (this.length) {
                    var n = 'scrollTop' in this[0]
                    return t === e
                        ? n
                            ? this[0].scrollTop
                            : this[0].pageYOffset
                        : this.each(
                              n
                                  ? function () {
                                        this.scrollTop = t
                                    }
                                  : function () {
                                        this.scrollTo(this.scrollX, t)
                                    }
                          )
                }
            },
            scrollLeft: function (t) {
                if (this.length) {
                    var n = 'scrollLeft' in this[0]
                    return t === e
                        ? n
                            ? this[0].scrollLeft
                            : this[0].pageXOffset
                        : this.each(
                              n
                                  ? function () {
                                        this.scrollLeft = t
                                    }
                                  : function () {
                                        this.scrollTo(t, this.scrollY)
                                    }
                          )
                }
            },
            position: function () {
                if (this.length) {
                    var e = this[0],
                        t = this.offsetParent(),
                        r = this.offset(),
                        i = g.test(t[0].nodeName) ? { top: 0, left: 0 } : t.offset()
                    return (
                        (r.top -= parseFloat(n(e).css('margin-top')) || 0),
                        (r.left -= parseFloat(n(e).css('margin-left')) || 0),
                        (i.top += parseFloat(n(t[0]).css('border-top-width')) || 0),
                        (i.left += parseFloat(n(t[0]).css('border-left-width')) || 0),
                        {
                            top: r.top - i.top,
                            left: r.left - i.left
                        }
                    )
                }
            },
            offsetParent: function () {
                return this.map(function () {
                    for (
                        var e = this.offsetParent || u.body;
                        e && !g.test(e.nodeName) && 'static' == n(e).css('position');

                    )
                        e = e.offsetParent
                    return e
                })
            }
        }),
        (n.fn.detach = n.fn.remove),
        ['width', 'height'].forEach(function (t) {
            var r = t.replace(/./, function (e) {
                return e[0].toUpperCase()
            })
            n.fn[t] = function (i) {
                var o,
                    a = this[0]
                return i === e
                    ? C(a)
                        ? a['inner' + r]
                        : N(a)
                        ? a.documentElement['scroll' + r]
                        : (o = this.offset()) && o[t]
                    : this.each(function (e) {
                          ;(a = n(this)).css(t, $(this, i, e, a[t]()))
                      })
            }
        }),
        ['after', 'prepend', 'before', 'append'].forEach(function (t, r) {
            var i = r % 2
            ;(n.fn[t] = function () {
                var t,
                    o,
                    a = n.map(arguments, function (r) {
                        var i = []
                        return 'array' == (t = D(r))
                            ? (r.forEach(function (t) {
                                  return t.nodeType !== e
                                      ? i.push(t)
                                      : n.zepto.isZ(t)
                                      ? (i = i.concat(t.get()))
                                      : void (i = i.concat(P.fragment(t)))
                              }),
                              i)
                            : 'object' == t || null == r
                            ? r
                            : P.fragment(r)
                    }),
                    s = this.length > 1
                return a.length < 1
                    ? this
                    : this.each(function (e, t) {
                          ;(o = i ? t : t.parentNode),
                              (t =
                                  0 == r
                                      ? t.nextSibling
                                      : 1 == r
                                      ? t.firstChild
                                      : 2 == r
                                      ? t
                                      : null)
                          var c = n.contains(u.documentElement, o)
                          a.forEach(function (e) {
                              if (s) e = e.cloneNode(!0)
                              else if (!o) return n(e).remove()
                              o.insertBefore(e, t),
                                  c &&
                                      Y(e, function (e) {
                                          if (
                                              !(
                                                  null == e.nodeName ||
                                                  'SCRIPT' !== e.nodeName.toUpperCase() ||
                                                  (e.type && 'text/javascript' !== e.type) ||
                                                  e.src
                                              )
                                          ) {
                                              var t = e.ownerDocument
                                                  ? e.ownerDocument.defaultView
                                                  : window
                                              t.eval.call(t, e.innerHTML)
                                          }
                                      })
                          })
                      })
            }),
                (n.fn[i ? t + 'To' : 'insert' + (r ? 'Before' : 'After')] = function (e) {
                    return n(e)[t](this), this
                })
        }),
        (P.Z.prototype = q.prototype = n.fn),
        (P.uniq = o),
        (P.deserializeValue = V),
        (n.zepto = P),
        n
    )
})()
