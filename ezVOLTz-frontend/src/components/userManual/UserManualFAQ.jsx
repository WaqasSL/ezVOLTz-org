import { Disclosure } from "@headlessui/react";
import { animationProps } from "helper/functionality";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { Fade } from "react-reveal";

const UserManualFAQ = () => {
  return (
    <div className="bg-white md:px-10 mb-20">
      <Fade {...animationProps}>
        <h2 className="text-ezBlack text-2xl md:text-4xl font-bold mt-16 md:mt-20 text-center">
          Frequently Ask Questions
        </h2>
      </Fade>
      <div className="block w-full">
        <dl className="my-10 space-y-6">
          <Fade {...animationProps}>
            <Disclosure
              as="div"
              className="border border-ezLightGray p-3 md:p-5 rounded-md"
            >
              {({ open }) => (
                <>
                  <dt>
                    <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                      <span
                        className={`${
                          open ? "text-ezGreen" : "text-ezBlack"
                        }  text-sm md:text-base font-semibold`}
                      >
                        Q: What do your map icons mean?
                      </span>
                      <span className="ml-6 flex h-7 items-center">
                        {open ? (
                          <AiOutlineMinus className="h-5 w-5" />
                        ) : (
                          <AiOutlinePlus className="h-5 w-5" />
                        )}
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as="dd" className="mt-5">
                    <ul className="text-ezGray space-y-1 text-sm md:text-base block">
                      <li>
                        Purple pin drop - Fast Charger (double lightning bolt)
                      </li>
                      <li>
                        Green pin drop - Level 2 Charger (single lightning bolt)
                      </li>
                      <li>Black pin drop - Level 1 Charger</li>
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </Fade>
          <Fade {...animationProps}>
            <Disclosure
              as="div"
              className="border border-ezLightGray p-3 md:p-5 rounded-md"
            >
              {({ open }) => (
                <>
                  <dt>
                    <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                      <span
                        className={`${
                          open ? "text-ezGreen" : "text-ezBlack"
                        }  text-sm md:text-base font-semibold`}
                      >
                        Q: How can I contact you?
                      </span>
                      <span className="ml-6 flex h-7 items-center">
                        {open ? (
                          <AiOutlineMinus className="h-5 w-5" />
                        ) : (
                          <AiOutlinePlus className="h-5 w-5" />
                        )}
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as="dd" className="mt-5">
                    <p className="text-ezGray text-sm md:text-base">
                      Drop us an email at{" "}
                      <a
                        href="http://info@ezvoltz.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ezGreen hover:text-ezGreen"
                      >
                        info@ezvoltz.com
                      </a>
                      .
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </Fade>
          <Fade {...animationProps}>
            <Disclosure
              as="div"
              className="border border-ezLightGray p-3 md:p-5 rounded-md"
            >
              {({ open }) => (
                <>
                  <dt>
                    <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                      <span
                        className={`${
                          open ? "text-ezGreen" : "text-ezBlack"
                        }  text-sm md:text-base font-semibold`}
                      >
                        Q: Do I need to create an account to use ezVOLTz?
                      </span>
                      <span className="ml-6 flex h-7 items-center">
                        {open ? (
                          <AiOutlineMinus className="h-5 w-5" />
                        ) : (
                          <AiOutlinePlus className="h-5 w-5" />
                        )}
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as="dd" className="mt-5">
                    <ul className="text-ezGray text-sm md:text-base list-disc list-inside space-y-1">
                      <li>
                        No, you don’t need an account, and it is free to use
                        ezVOLTz. Signing up allows you to save planned trips and
                        add comments about charging locations.
                      </li>
                      <li>
                        To create an account, follow prompts, or access the
                        account signup through the menu and select “View
                        Profile”.
                      </li>
                      <li>
                        Fill in the information and select an account username
                        and password.
                      </li>
                      <li>
                        You’ll receive a confirmation email, click on the link
                        provided to confirm your account.
                      </li>
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </Fade>
          <Fade {...animationProps}>
            <Disclosure
              as="div"
              className="border border-ezLightGray p-3 md:p-5 rounded-md"
            >
              {({ open }) => (
                <>
                  <dt>
                    <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                      <span
                        className={`${
                          open ? "text-ezGreen" : "text-ezBlack"
                        }  text-sm md:text-base font-semibold`}
                      >
                        Q: How do I Plan a Trip using the ezVOLTz app?
                      </span>
                      <span className="ml-6 flex h-7 items-center">
                        {open ? (
                          <AiOutlineMinus className="h-5 w-5" />
                        ) : (
                          <AiOutlinePlus className="h-5 w-5" />
                        )}
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as="dd" className="mt-5">
                    <ul className="text-ezGray text-sm md:text-base space-y-2 list-disc list-inside">
                      <li>
                        On the app home/map page, click on the Map icon on the
                        bottom{" "}
                        <img
                          src="/assets/svgs/icons/plan.svg"
                          alt=""
                          className="w-6 h-auto inline-block mx-1"
                        />
                      </li>
                      <li>
                        Enter your starting location, or click on the{" "}
                        <img
                          src="/assets/svgs/icons/gps.svg"
                          alt=""
                          className="w-6 h-auto inline-block mx-1"
                        />{" "}
                        and use your current location
                      </li>
                      <li>Enter destination</li>
                      <li>
                        (Optional) choose a start date and time, choose to avoid
                        tolls or highways
                      </li>
                      <li>Select Next Step</li>
                      <li>
                        Add your vehicle info or previously added vehicle will
                        default
                      </li>
                      <li>
                        (Optional) Select “show only available chargers”,
                        network or connector type filters
                      </li>
                      <li>Click “Next Step”.</li>
                      <li>
                        Map will pop up. Click on (info icon) to see route
                        distance, time and estimated charging cost.
                      </li>
                      <li>
                        Select your charging waypoints along your route by
                        clicking on a charger icon
                        <ol className="list-inside pl-6 lowerAlpha">
                          <li> Black - Level 1 Charger</li>
                          <li> Green - Level 2 Charger</li>
                          <li> Purple - Fast Charger</li>
                        </ol>
                      </li>
                      <li>
                        A white dialogue box with charger info will pop up. To
                        add waypoint, click on the green “Add as Waypoint”
                        button
                      </li>
                      <li>You can add multiple waypoints</li>
                      <li>
                        Click on the <b className="text-ezGreen">“Save”</b>{" "}
                        button at the upper right when your trip plan is
                        complete.
                      </li>
                    </ul>
                    <br />
                    <p className="text-ezGreen text-sm md:text-base">
                      <em>Trip is saved!</em>
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </Fade>
          <Fade {...animationProps}>
            <Disclosure
              as="div"
              className="border border-ezLightGray p-3 md:p-5 rounded-md"
            >
              {({ open }) => (
                <>
                  <dt>
                    <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                      <span
                        className={`${
                          open ? "text-ezGreen" : "text-ezBlack"
                        }  text-sm md:text-base font-semibold`}
                      >
                        Q: I’ve set up my trip - how do I start?
                      </span>
                      <span className="ml-6 flex h-7 items-center">
                        {open ? (
                          <AiOutlineMinus className="h-5 w-5" />
                        ) : (
                          <AiOutlinePlus className="h-5 w-5" />
                        )}
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as="dd" className="mt-5">
                    <ul className="text-ezGray text-sm md:text-base space-y-2 mb-8">
                      <li>
                        Click on{" "}
                        <img
                          src="/assets/svgs/icons/grayNavigate.svg"
                          alt=""
                          className="w-6 h-auto inline-block mx-1"
                        />
                        on home/map page and your saved trips will display. Or
                        select previous trips to repeat a past trip.
                      </li>
                      <li>
                        Click on the{" "}
                        <img
                          src="/assets/svgs/icons/navigate.svg"
                          alt=""
                          className="w-6 h-auto inline-block mx-1"
                        />{" "}
                        to start your trip. (Navigation will only be available
                        if you’re at your starting location).
                      </li>
                      <li>
                        Or in the map view that pops up, scroll down to select
                        the “Let’s Go” button.
                      </li>
                      <li>
                        When you’re at your starting location, your trip is
                        available to start and{" "}
                        <img
                          src="/assets/svgs/icons/start.svg"
                          alt=""
                          className="w-14 h-auto inline-block mx-1"
                        />{" "}
                        will appear on Google Maps.
                      </li>
                    </ul>
                    <h4 className="text-ezBlack font-bold text-base mb-3">
                      To edit a saved trip:
                    </h4>
                    <p className="text-ezGray text-sm md:text-base mb-3">
                      Before you start a trip, you can always edit, change, or
                      add waypoints. Click on{" "}
                      <img
                        src="/assets/svgs/icons/grayNavigate.svg"
                        alt=""
                        className="w-6 h-auto inline-block mx-1"
                      />{" "}
                      on home/map page and your saved trips will display. Or
                      select previous trips to repeat a past trip.
                    </p>
                    <p className="text-ezGray text-sm md:text-base mb-3">
                      To edit, click on the saved trip, and select the{" "}
                      <img
                        src="/assets/svgs/icons/navigate.svg"
                        alt=""
                        className="w-6 h-auto inline-block mx-1"
                      />{" "}
                      on the right side of the trip. On the map view, click on
                      the{" "}
                      <img
                        src="/assets/svgs/icons/edit.svg"
                        alt=""
                        className="w-6 h-auto inline-block mx-1"
                      />{" "}
                      to edit, or the{" "}
                      <img
                        src="/assets/svgs/icons/del.svg"
                        alt=""
                        className="w-6 h-auto inline-block mx-1"
                      />{" "}
                      to delete the trip.
                    </p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </Fade>
          <Fade {...animationProps}>
            <Disclosure
              as="div"
              className="border border-ezLightGray p-3 md:p-5 rounded-md"
            >
              {({ open }) => (
                <>
                  <dt>
                    <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                      <span
                        className={`${
                          open ? "text-ezGreen" : "text-ezBlack"
                        }  text-sm md:text-base font-semibold`}
                      >
                        Q: How can I filter the map for only charging stations
                        that match my car?
                      </span>
                      <span className="ml-6 flex h-7 items-center">
                        {open ? (
                          <AiOutlineMinus className="h-5 w-5" />
                        ) : (
                          <AiOutlinePlus className="h-5 w-5" />
                        )}
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as="dd" className="mt-5">
                    <ul className="text-ezGray text-sm md:text-base space-y-2 list-inside list-disc">
                      <li>
                        The filter icon{" "}
                        <img
                          src="/assets/svgs/icons/blackHamBurger.svg"
                          alt=""
                          className="w-6 h-auto inline-block mx-1"
                        />{" "}
                        is located on the map home page next to the search bar.
                      </li>
                      <li>
                        Filter for network type, connector type, public/private
                        chargers, owner type, fuel type, or AC/DC level.
                      </li>
                      <li>
                        When filters are selected, click on “Apply Filters”.
                      </li>
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </Fade>
        </dl>
      </div>
    </div>
  );
};

export default UserManualFAQ;
