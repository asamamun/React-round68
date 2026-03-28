const Item = ({Title, Author, NumComments, Points}) => (
    <li>
        <a href="#">{Title}</a> written by <span>{Author}</span>, Total comments :  
        <span>{NumComments}</span>, Total points : <span>{Points}</span>
    </li>
);

const List = ({lists}) => {
    
    return (
        <ul>
            {lists.map(({objectID, ...rest},index) => ( 
               <Item key={objectID} {...rest} />  // Using spread operator to pass multiple props
            ))}
        </ul>
    );
};
export default List;
