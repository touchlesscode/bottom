import React, {
  createContext,
  useRef,
  useEffect,
  useContext,
  useState,
} from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const ScrollContext = createContext();
const initialState = {
  tab: "box-red",
};

const actions = {
  CHANGE_TAB: "CHANGE_TAB",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.CHANGE_TAB:
      return {
        tab: action.tab,
      };
    default:
      return state;
  }
};
function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const value = {
    tab: state.tab,
    changeTab: (tab) => {
      dispatch({ type: actions.CHANGE_TAB, tab });
    },
  };

  return (
    <div>
      <ScrollContext.Provider value={value}>
        <ScrollContainer />
        <ScrollNavigator />
      </ScrollContext.Provider>
    </div>
  );
}

/**
 * returns the percent of visible part of the element in viewport
 * @param {*} el
 */
const visibleViewportInPercent = (el) => {
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const rect = el.getBoundingClientRect();

  if (rect.bottom < 0 || rect.top > windowHeight) return 0;

  const top = Math.max(0, rect.top);
  const bottom = Math.min(windowHeight, rect.bottom);

  return ((bottom - top) * 1.0) / rect.height;
};

const isInViewport = (el) => {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const ScrollContainer = () => {
  const containerRef = useRef();
  const { changeTab } = useContext(ScrollContext);

  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      let maxPercent = 0;
      let maxPercentId = ""; // TODO: current tab id;

      for (const child of containerRef.current.children) {
        const percent = visibleViewportInPercent(child);
        if (percent > maxPercent) {
          maxPercent = percent;
          maxPercentId = child.id;
        }
        if (isInViewport(child)) {
          maxPercentId = child.id;
          break;
        }
      }

      changeTab(maxPercentId);
    });
  }, []);

  return (
    <div ref={containerRef} className="p-2">
      <div
        id="box-red"
        className="bg-red-500 h-[600px] flex justify-center items-center"
      >
        Red
      </div>
      <div
        id="box-green"
        className="bg-green-500 h-[600px] flex justify-center items-center"
      >
        Green
      </div>
      <div
        id="box-blue"
        className="bg-blue-500 h-[600px] flex justify-center items-center"
      >
        Blue
      </div>
      <div
        id="box-yellow"
        className="bg-yellow-500 h-[600px] flex justify-center items-center"
      >
        Yellow
      </div>
      <div
        id="box-orange"
        className="bg-orange-500 h-[600px] flex justify-center items-center"
      >
        Orange
      </div>
      <div
        id="box-pink"
        className="bg-pink-500 h-[600px] flex justify-center items-center"
      >
        Pink
      </div>
    </div>
  );
};

const ScrollNavigator = ({}) => {
  const carousel = useRef();
  const [width, setWidth] = useState(0);
  const { tab } = React.useContext(ScrollContext);

  useEffect(() => {
    console.log("scroll: ", tab);
    // setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
  }, [tab]);

  useEffect(() => {
    setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
  });

  return (
    <motion.div
      ref={carousel}
      className="fixed bottom-4 w-[80%] transform -translate-x-1/2 left-1/2 h-max text-lg rounded-full bg-white  overflow-x-hidden"
    >
      <motion.div
        drag="x"
        dragConstraints={{ right: 0, left: -width }}
        className="flex gap-x-4 w-max px-4"
      >
        {["red", "green", "blue", "yellow", "orange", "pink"].map((color) => (
          <ScrollNavigatorItem id={`box-${color}-tab`} color={color} />
        ))}
      </motion.div>
    </motion.div>
  );
};

const ScrollNavigatorItem = ({ id, color }) => {
  return (
    <div onClick={e => console.log("click: ", id)} id={id} className="py-4 px-4 text-lg flex items-center cursor-pointer">
      <div className={`bg-${color}-500 rounded-full w-4 h-4 mr-4`} />
      {color}
    </div>
  );
};

export default App;
