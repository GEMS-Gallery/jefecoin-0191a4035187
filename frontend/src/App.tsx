import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Box, Button, Typography, TextField, CircularProgress } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import Modal from 'react-modal';

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: theme.palette.common.white,
}));

const SlotMachine = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const spinAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-${100 / 6}%);
  }
`;

const slowSpinAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-${100 / 6}%);
  }
`;

const Reel = styled(Box)<{ spinning: boolean; slowing: boolean }>(({
  theme,
  spinning,
  slowing
}) => ({
  fontSize: '4rem',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.common.black,
  overflow: 'hidden',
  height: '6rem',
  '& > div': {
    display: 'flex',
    flexDirection: 'column',
    animation: spinning
      ? `${spinAnimation} 0.5s linear infinite`
      : slowing
      ? `${slowSpinAnimation} 2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards`
      : 'none',
  }
}));

const symbols = ["🍒", "🍋", "🍊", "🍇", "💰", "7️⃣"];

const App: React.FC = () => {
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [currentSymbols, setCurrentSymbols] = useState<string[]>(['', '', '']);
  const [bet, setBet] = useState<string>('10');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isSlowing, setIsSlowing] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>('');

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const result = await backend.getBalance();
      setBalance(result);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleSpin = async () => {
    setIsSpinning(true);
    setIsSlowing(false);
    try {
      setTimeout(() => {
        setIsSpinning(false);
        setIsSlowing(true);
      }, 2000);

      setTimeout(async () => {
        const result = await backend.spin(BigInt(bet));
        if ('ok' in result) {
          setCurrentSymbols(result.ok.symbols);
          setModalContent(`You won ${result.ok.winAmount.toString()} JefeCoins!`);
        } else {
          setModalContent(result.err);
        }
        setModalIsOpen(true);
        fetchBalance();
        setIsSlowing(false);
      }, 4000);
    } catch (error) {
      console.error('Error spinning:', error);
      setModalContent('An error occurred while spinning.');
      setModalIsOpen(true);
      setIsSpinning(false);
      setIsSlowing(false);
    }
  };

  return (
    <StyledBox>
      <Typography variant="h2" gutterBottom>
        JefeCoin Slot Machine
      </Typography>
      <Typography variant="h4" gutterBottom>
        Balance: {balance.toString()} JefeCoins
      </Typography>
      <SlotMachine>
        {[0, 1, 2].map((index) => (
          <Reel key={index} spinning={isSpinning} slowing={isSlowing}>
            <div>
              {[...symbols, ...symbols].map((symbol, i) => (
                <div key={i}>{symbol}</div>
              ))}
            </div>
          </Reel>
        ))}
      </SlotMachine>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
        <TextField
          label="Bet"
          variant="outlined"
          value={bet}
          onChange={(e) => setBet(e.target.value)}
          type="number"
          InputProps={{ inputProps: { min: 1 } }}
          sx={{
            input: { color: 'white' },
            label: { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' },
            },
          }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSpin}
          disabled={isSpinning || isSlowing}
          startIcon={(isSpinning || isSlowing) ? <CircularProgress size={20} /> : null}
        >
          {(isSpinning || isSlowing) ? 'Spinning...' : 'Spin'}
        </Button>
      </Box>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Spin Result"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#8B0000',
            color: '#FFD700',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center',
          },
        }}
      >
        <Typography variant="h5">{modalContent}</Typography>
        <Button onClick={() => setModalIsOpen(false)} sx={{ marginTop: 2 }}>
          Close
        </Button>
      </Modal>
    </StyledBox>
  );
};

export default App;
