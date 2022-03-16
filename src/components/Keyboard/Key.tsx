import styled from 'styled-components';

type KeyProps = {
  bg: string;
  'data-key': string;
  label: string;
  onClick: any;
  style?: any;
}
function Key({ label, ...restProps }: KeyProps) {
  return (
    <StyledKey {...restProps}>{label}</StyledKey>
  )
}

const StyledKey = styled.button<{ bg?: string }>`
  background: #818384;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  height: 58px;
  margin: 6px 5px 0 0;
  width: 42px;
  text-transform: uppercase;
  background: ${({ bg }) => bg};
  transition: background .1s linear 1s};
`;

export default Key;