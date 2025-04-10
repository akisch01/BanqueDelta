import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Link } from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  HelpOutline as HelpIcon,
  ContactSupport as ContactIcon,
  Article as ArticleIcon
} from '@mui/icons-material';

const Help = () => {
  const faqs = [
    {
      question: "Comment créer un nouveau compte?",
      answer: "Allez dans la section Comptes et cliquez sur 'Nouveau compte'."
    },
    {
      question: "Comment effectuer un virement?",
      answer: "Sélectionnez un client, puis utilisez l'option 'Effectuer un virement'."
    }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <HelpIcon color="primary" /> Centre d'aide
      </Typography>
      
      {faqs.map((faq, index) => (
        <Accordion key={index} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 500 }}>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
      
      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Link href="#" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ContactIcon /> Contacter le support
        </Link>
        <Link href="#" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArticleIcon /> Documentation complète
        </Link>
      </Box>
    </Box>
  );
};

export default Help;