import { useDrag } from 'react-dnd';
import {
  FaChessKing, FaChessQueen, FaChessRook,
  FaChessBishop, FaChessKnight, FaChessPawn
} from 'react-icons/fa6';

export const ItemTypes = {
  PIECE: 'piece'
};

const Piece = ({ type, color, square, draggable }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { type, color, square },
    canDrag: () => draggable,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [draggable, type, color, square]);

  const drag = draggable ? dragRef : null;

  const iconProps = {
    size: '3rem',
    style: {
      color: color === 'w' ? '#f8fafc' : '#1e293b',
      filter: color === 'w'
        ? 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.6))'
        : 'drop-shadow(0 4px 6px rgba(255, 255, 255, 0.1))',
      transition: 'transform 0.2s ease',
      cursor: 'grab'
    }
  };

  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'k': return <FaChessKing {...iconProps} />;
      case 'q': return <FaChessQueen {...iconProps} />;
      case 'r': return <FaChessRook {...iconProps} />;
      case 'b': return <FaChessBishop {...iconProps} />;
      case 'n': return <FaChessKnight {...iconProps} />;
      case 'p': return <FaChessPawn {...iconProps} />;
      default: return null;
    }
  };

  return (
    <div 
      ref={drag}
      className="piece-container" 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        zIndex: 10,
        opacity: isDragging ? 0.4 : 1,
        cursor: 'grab'
      }}
    >
      {getIcon()}
    </div>
  );
};

export default Piece;
