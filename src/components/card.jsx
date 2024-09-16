import '../styles/Card.css';

const Card = ({ image, name, desc }) => {
  return (
    <div className={`card ${name}`}>
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>{desc}</p>
    </div>
  );
};

export default Card;
