import React from 'react';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Slideshow = () => {
  return (
    <Carousel
	    autoPlay
	    stopOnHover
	    swipeable
	    infiniteLoop
	    emulateTouch
	    onSwipeEnd={() => console.log("onSwipeEnd")}
	    onClickItem={index => console.log("click item", index)}
	    showArrows={false}
	    showThumbs={false}
	  >
	    <div>
	      <img alt="Crypto currency prices" src="/img/homepage/slideshow/1.png" />
	      {/*<p className="legend">Legend 1</p>*/}
	    </div>
	    <div>
	      <img alt="Crypto currency Investment" src="/img/homepage/slideshow/2.png" />
	      {/*<p className="legend">Legend 2</p>*/}
	    </div>
	    <div>
	      <img alt="Digital Currencies" src="/img/homepage/slideshow/3.png" />
	      {/*<p className="legend">Legend 3</p>*/}
	    </div>
	    <div>
	      <img alt="Blockchain in wealth Management" src="/img/homepage/slideshow/4.png" />
	      {/*<p className="legend">Legend 4</p>*/}
	    </div>
	  </Carousel>
  )
};

export default Slideshow;