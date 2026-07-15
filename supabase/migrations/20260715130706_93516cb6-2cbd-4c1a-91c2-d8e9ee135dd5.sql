
CREATE TABLE public.service_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Zap',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  items text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.service_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_items TO authenticated;
GRANT ALL ON public.service_items TO service_role;

ALTER TABLE public.service_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "services public read" ON public.service_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "services admin insert" ON public.service_items FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "services admin update" ON public.service_items FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "services admin delete" ON public.service_items FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.tg_service_items_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER trg_service_items_updated_at BEFORE UPDATE ON public.service_items FOR EACH ROW EXECUTE FUNCTION public.tg_service_items_updated_at();

INSERT INTO public.service_items (icon, title, description, items, sort_order) VALUES
('Factory', 'Elétrica Industrial', 'Montagem de painéis, quadros de comando, barramentos, subestações e alimentação de máquinas.', E'Painéis CCM e QGBT\nInstalação de motores\nAterramento industrial\nRetrofit de plantas', 10),
('Building2', 'Elétrica Predial e Comercial', 'Projetos e execução em edifícios, condomínios, lojas e escritórios com padrão de acabamento.', E'Entrada de energia\nCircuitos e tomadas\nIluminação profissional\nAdequação NBR 5410', 20),
('Cpu', 'Automação Industrial', 'Programação de CLPs, IHMs, inversores e sistemas SCADA para linhas de produção.', E'CLP Siemens / Allen-Bradley\nInversores de frequência\nSupervisórios\nRetrofit de comando', 30),
('HardHat', 'Manutenção Preventiva de Subestação', 'Inspeções, ensaios elétricos e manutenção completa em subestações de média e alta tensão.', E'Termografia em barramentos\nEnsaios em transformadores\nLimpeza e reaperto\nRelatório técnico com ART', 40),
('Activity', 'Ensaio de EPCs e EPIs', 'Testes elétricos e certificação de equipamentos de proteção coletiva e individual conforme NR-10.', E'Ensaio dielétrico\nVara de manobra\nLuvas isolantes\nAterramento temporário', 50),
('ShieldCheck', 'SPDA & Aterramento', 'Sistemas de proteção contra descargas atmosféricas e malhas de aterramento certificadas.', E'Projeto NBR 5419\nMedição ôhmica\nMalha de terra\nDPS e equipotencialização', 60),
('Battery', 'Energia Solar Fotovoltaica', 'Projeto e instalação de sistemas on-grid residenciais, comerciais e industriais.', E'Dimensionamento\nHomologação junto à concessionária\nMonitoramento em nuvem\nO&M anual', 70),
('Lightbulb', 'Iluminação Técnica', 'Projetos luminotécnicos com cálculo de lux e eficiência energética.', E'LED industrial\nIluminação de emergência\nLighting design\nRetrofit LED', 80),
('Cable', 'Infraestrutura & Cabeamento', 'Eletrocalhas, leitos, cabeamento estruturado e infraestrutura de dados.', E'Cat6 / Cat6A\nFibra óptica\nData center\nRack e patch panel', 90),
('Wrench', 'Manutenção Preventiva', 'Contratos mensais e trimestrais com relatórios técnicos e atendimento emergencial 24h.', E'Termografia\nAnálise de qualidade de energia\nPlantão 24h\nRelatórios técnicos', 100);
