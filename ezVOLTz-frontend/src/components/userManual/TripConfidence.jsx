import { animationProps } from "helper/functionality";
import React from "react";
import { Fade } from "react-reveal";

const TripConfidence = () => {
  return (
    <div className="bg-white px-2s md:px-10 mb-20">
      <Fade {...animationProps}>
        <h2 className="text-ezBlack text-xl md:text-2xl font-bold mb-3">
          Plan a trip with confidence
        </h2>
      </Fade>
      <Fade {...animationProps}>
        <p className="text-ezBlack text-base md:text-lg mb-5">
          Use ezVOLTz to plan your trip anywhere in the USA and eliminate Range
          Anxiety! Select your destination, view your route and select
          recharging stops along the way.{" "}
        </p>
      </Fade>
      <ul className="list-decimal list-inside block text-ezBlack space-y-3">
        <Fade {...animationProps}>
          <li>
            Start planning with the{" "}
            <img
              src="/assets/svgs/icons/plan.svg"
              alt=""
              className="w-6 h-auto inline-block mx-1"
            />{" "}
            button on the home screen.
          </li>
        </Fade>
        <Fade {...animationProps}>
          <li>
            Enter start and destination. Use{" "}
            <img
              src="/assets/svgs/icons/gps.svg"
              alt=""
              className="w-6 h-auto inline-block mx-1"
            />{" "}
            for your current location, and date and time (optional).
          </li>
        </Fade>
        <Fade {...animationProps}>
          <li>
            Select options for avoiding tolls, highways, and traffic (optional).
          </li>
        </Fade>
        <Fade {...animationProps}>
          <li>
            Add vehicle info (or use saved). Automatically see only chargers
            that are compatible.
          </li>
        </Fade>
        <Fade {...animationProps}>
          <li>Click "Next Step".</li>
        </Fade>
        <Fade {...animationProps}>
          <li>Select charging stops on the map and add as Waypoint.</li>
        </Fade>
        <Fade {...animationProps}>
          <li>You can add multiple waypoints</li>
        </Fade>
        <Fade {...animationProps}>
          <li>Save!</li>
        </Fade>
        <Fade {...animationProps}>
          <li>
            Start - If you’re already at your trip starting point, click on the{" "}
            <img
              src="/assets/svgs/icons/navigate.svg"
              alt=""
              className="w-6 h-auto inline-block mx-1"
            />
            and start your trip in google maps with your pre-selected stops.
          </li>
        </Fade>
        <Fade {...animationProps}>
          <li>Add or adjust waypoints on the way as needed.</li>
        </Fade>
      </ul>
    </div>
  );
};

export default TripConfidence;
