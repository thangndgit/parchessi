import { FaCircle } from "react-icons/fa";
import { colorsBase } from "../../../data/colors";
import { namesNodeC } from "../../../data/names";
import Node from "../Node/Node";
import css from "./Cage.module.css";

const Cage = (props) => {
  const { className, onMove, cageId } = props;

  const classes = [className, css.cage, css[`cage--${cageId}`]].join(" ");

  const color = colorsBase[cageId];

  return (
    <div className={classes}>
      <div className={css.door}>
        <Node variant="circle" borderColor={color} onMove={onMove} name={`b-${cageId * 14}`}>
          <FaCircle fill={color} size="auto" className="p-min" />
        </Node>
      </div>
      {namesNodeC[cageId].map((name, id) => (
        <Node
          variant="rectangle"
          color="#ffffff"
          borderWidth="0"
          borderRadius="3px"
          backgroundColor={color}
          name={name}
          onMove={onMove}
          key={name}
        >
          {id + 1}
        </Node>
      ))}
    </div>
  );
};

export default Cage;
