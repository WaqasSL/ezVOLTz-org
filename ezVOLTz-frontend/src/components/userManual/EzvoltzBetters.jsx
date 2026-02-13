import { animationProps } from "helper/functionality";
import React from "react";
import { Fade } from "react-reveal";

const EzvoltzBetter = () => {
  return (
    <div className="bg-ezLightWhite rounded-xl px-5 py-10 md:p-10">
      <Fade {...animationProps}>
        <h2 className="text-ezBlack text-xl md:text-2xl font-bold mb-5">
          Make ezVOLTz better for everyone!
        </h2>
      </Fade>
      <ul className="list-decimal list-inside block text-ezBlack space-y-3">
        <Fade {...animationProps}>
          <li>Add a missing or new station for the community.</li>
        </Fade>
        <Fade {...animationProps}>
          <li>
            Leave a review - select your charger and click on “Review” tab.
          </li>
        </Fade>
        <Fade {...animationProps}>
          <li>
            Contact us with your ideas to improve ezVOLTz at{" "}
            <a
              href="http://info@ezvoltz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ezGreen hover:text-ezGreen"
            >
              info@ezvoltz.com
            </a>
            . ( Click on{" "}
            <img
              src="/assets/svgs/icons/hamBurger.svg"
              alt=""
              className="w-6 h-auto inline-block mx-1"
            />{" "}
            icon)
          </li>
        </Fade>
        <Fade {...animationProps}>
          <li>
            Privacy policy and terms and conditions ( Click on{" "}
            <img
              src="/assets/svgs/icons/hamBurger.svg"
              alt=""
              className="w-6 h-auto inline-block mx-1"
            />{" "}
            icon )
          </li>
        </Fade>
        <Fade {...animationProps}>
          <li>
            About Us
            <a
              href="https://ezvoltz.com/about-us/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ezGreen hover:text-ezGreen"
            >
              <img
                src="/assets/svgs/icons/externalLink.svg"
                alt=""
                className="w-6 h-auto inline-block mx-1"
              />
            </a>
          </li>
        </Fade>
      </ul>
    </div>
  );
};

export default EzvoltzBetter;
