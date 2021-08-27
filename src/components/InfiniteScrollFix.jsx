import InfiniteScroll from "react-infinite-scroll-component"


function intentionalScrollTop (event) {
  return document.body.scrollTop === 0 && event.deltaY < 0;
}
  
function intentionalScrollBottom (deltaY) {
  // console.log('window.innerHeight')
  // console.log(window.innerHeight)
  // console.log('window.scrollY')
  // console.log(window.scrollY)
  // console.log('document.body.offsetHeight')
  // console.log(document.body.offsetHeight)
  // console.log('event.deltaY')
  // console.log(event.deltaY)
  // console.log('(window.innerHeight + window.scrollY) >= document.body.offsetHeight')
  // console.log((window.innerHeight + window.scrollY) >= document.body.offsetHeight)
  return (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1 && deltaY > 0;
}

class InfiniteScrollFix extends InfiniteScroll {

  touchStartY = 0

  onScrollListener = (event) => {
    if (typeof this.props.onScroll === 'function') {
      // Execute this callback in next tick so that it does not affect the
      // functionality of the library.
      setTimeout(() => this.props.onScroll && this.props.onScroll(event), 0);
    }

    const target =
      this.props.height || this._scrollableNode
        ? (event.target)
        : document.documentElement.scrollTop
        ? document.documentElement
        : document.body;

    // return immediately if the action has already been triggered,
    // prevents multiple triggers.
    // console.log(1)
    if (this.actionTriggered) return;
    // console.log(2)

    const atBottom = this.props.inverse
      ? this.isElementAtTop(target, this.props.scrollThreshold) ||
        intentionalScrollTop(event)
      : this.isElementAtBottom(target, this.props.scrollThreshold) || 
        intentionalScrollBottom(event);

      // console.log('intentionalScrollBottom(event)')
      // console.log(intentionalScrollBottom(event))
      // console.log('atBottom')
      // console.log(atBottom)

    // call the `next` function in the props to trigger the next data fetch
    if (atBottom && this.props.hasMore) {
      this.actionTriggered = true;
      this.setState({ showLoader: true });
      this.props.next && this.props.next();
    }

    this.lastScrollTop = target.scrollTop;
  };

  componentDidMount() {
    if (typeof this.props.dataLength === 'undefined') {
      throw new Error(
        `mandatory prop "dataLength" is missing. The prop is needed` +
          ` when loading more content. Check README.md for usage`
      );
    }

    this._scrollableNode = this.getScrollableTarget();
    this.el = this.props.height
      ? this._infScroll
      : this._scrollableNode || window;

    // if (this.el) {
    //   this.el.addEventListener('wheel', this
    //     .throttledOnScrollListener);
    // }

    // if (this.el) {
    //   this.el.addEventListener('touchmove', this
    //     .throttledOnScrollListener);
    // }

    if (this.el) {
      this.el.addEventListener('wheel', (e) => {
        if(intentionalScrollBottom(e.deltaY)) {
         this.throttledOnScrollListener(e)
        }
      })
      this.el.addEventListener('touchstart', (e) => {
        let evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent
        let touch = evt.touches[0] || evt.changedTouches[0]
        this.touchStartY = touch.clientY
      })
      this.el.addEventListener('touchend', (e) => {
        let evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent
        let touch = evt.touches[0] || evt.changedTouches[0]
        let touchEndY = touch.clientY
        if(intentionalScrollBottom(this.touchStartY - touchEndY)) {
         this.throttledOnScrollListener(e)
        }
      })
    }
  

    if (
      typeof this.props.initialScrollY === 'number' &&
      this.el &&
      this.el instanceof HTMLElement &&
      this.el.scrollHeight > this.props.initialScrollY
    ) {
      this.el.scrollTo(0, this.props.initialScrollY);
    }

    if (this.props.pullDownToRefresh && this.el) {
      this.el.addEventListener('touchstart', this.onStart);
      this.el.addEventListener('touchmove', this.onMove);
      this.el.addEventListener('touchend', this.onEnd);

      this.el.addEventListener('mousedown', this.onStart);
      this.el.addEventListener('mousemove', this.onMove);
      this.el.addEventListener('mouseup', this.onEnd);

      // get BCR of pullDown element to position it above
      this.maxPullDownDistance =
        (this._pullDown &&
          this._pullDown.firstChild &&
          (this._pullDown.firstChild).getBoundingClientRect()
            .height) ||
        0;
      this.forceUpdate();

      if (typeof this.props.refreshFunction !== 'function') {
        throw new Error(
          `Mandatory prop "refreshFunction" missing.
          Pull Down To Refresh functionality will not work
          as expected. Check README.md for usage'`
        );
      }
    }
    // this.onScrollListener()
  }

  // componentDidUpdate(){
  //   this.onScrollListener()
  // }

}

export default InfiniteScrollFix 
