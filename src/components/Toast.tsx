import styled from 'styled-components';

export default function Toast({ error }: { error: string | null }) {
  // todo: can toast dismiss itself?
  return (
    <Container>
      {error && (
        <div style={{ fontWeight: 'bold', padding: '16px' }}>
          {error}
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, 0);
  pointer-events: none;
  width: fit-content;
  background: white;
  color: black;
  border-radius: 6px;
  z-index: 2;
`;