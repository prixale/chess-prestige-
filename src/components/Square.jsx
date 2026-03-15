import { useDrop } from 'react-dnd';
import { ItemTypes } from './Piece';

const Square = ({ isDark, position, onDropPiece, customColor, children }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (item) => {
      onDropPiece(item.square);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  }), [onDropPiece]);

  const bg = customColor || (isDark ? 'var(--square-dark)' : 'var(--square-light)');
  // Indicador visual de hover si es posible soltar
  const overlay = isOver && canDrop ? 'var(--square-highlight)' : 'transparent';

  return (
    <div
      ref={drop}
      className="square"
      style={{
        backgroundColor: bg,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'background-color 0.2s ease'
      }}
    >
      {/* Overlay de highlight para Drop */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        height: '100%', width: '100%',
        backgroundColor: overlay,
        zIndex: 5,
        pointerEvents: 'none'
      }} />

      {/* Etiqueta de posición discreta */}
      <span style={{
        position: 'absolute',
        bottom: '2px',
        right: '4px',
        fontSize: '10px',
        opacity: 0.2,
        color: isDark ? '#fff' : '#000',
        pointerEvents: 'none',
        zIndex: 6
      }}>
        {position}
      </span>
      {children}
    </div>
  );
};

export default Square;
