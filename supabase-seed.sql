-- ═══ SEED DATA ═══

-- TEAM
INSERT INTO team (id, name, role, dept, cap, used, avatar, color, skills) VALUES
  ('u1','Vraj','AI Engineer','Engineering',40,34,'VR','#3b82f6',ARRAY['Python','n8n','OpenAI','RAG']),
  ('u2','Sahil','Automation Lead','Engineering',40,38,'SA','#7c3aed',ARRAY['n8n','Make','Zapier','Airtable']),
  ('u3','Diya','Project Manager','Operations',40,36,'DI','#0891b2',ARRAY['PM','Scoping','Client Mgmt']),
  ('u4','Smit','Full-Stack Dev','Engineering',40,30,'SM','#c2410c',ARRAY['React','Node','Supabase','APIs']),
  ('u5','Priyam','AI Strategist','Strategy',40,28,'PR','#16a34a',ARRAY['Strategy','Prompt Eng','GPT']);

-- CLIENTS
INSERT INTO clients (id, name, industry, health, type, contact, stack) VALUES
  ('cl1','Meridian Health','Healthcare','healthy','Fixed Fee','Dr. Rivera, CTO',ARRAY['Epic EMR','Azure']),
  ('cl2','Vertex Capital','Financial Services','at-risk','Retainer','James Park, VP Ops',ARRAY['Salesforce','HubSpot']),
  ('cl3','Sterling Legal','Legal','healthy','Fixed Fee','M. Walsh, Partner',ARRAY['iManage','Azure']),
  ('cl4','NovaTech Labs','Technology','healthy','Discovery','Raj Patel, CTO',ARRAY['AWS','Jira']),
  ('cl5','BlueHarbor Retail','Retail','critical','Fixed Fee','Chen Wei, VP Eng',ARRAY['Shopify','BigQuery']),
  ('cl6','Apex Realty','Real Estate','healthy','Discovery','Tom Hartman',ARRAY['Twilio']);

-- PROJECTS
INSERT INTO projects (id, name, client_id, stage, health, pm, team_ids, start_date, target_date, type, budget, billed, description, risks, objectives) VALUES
  ('p1','Patient Intake Chatbot','cl1','Build','healthy','u3',ARRAY['u1','u3','u4'],'2026-02-01','2026-04-15','AI Agent','$85,000','$42,500','GPT-powered patient intake chatbot with EMR integration and HIPAA compliance.',ARRAY['EMR API rate limits','HIPAA audit timeline'],ARRAY['60% faster intake','95% satisfaction','HIPAA compliant']),
  ('p2','Sales Pipeline Automation','cl2','Build','at-risk','u3',ARRAY['u2','u4','u3'],'2026-02-15','2026-04-01','Automation','$62,000','$31,000','CRM automation: AI lead scoring, outreach sequences, pipeline analytics.',ARRAY['Client data export delayed'],ARRAY['80% less manual entry','<5min response']),
  ('p3','Contract Analysis AI','cl3','Client Review','healthy','u3',ARRAY['u1','u5','u4'],'2026-01-15','2026-03-30','AI Agent','$95,000','$76,000','NLP contract clause extraction and risk scoring.',ARRAY[]::TEXT[],ARRAY['95% extraction accuracy','90%+ risk reliability']),
  ('p4','Workflow Orchestration','cl4','Proposal','healthy','u3',ARRAY['u2','u3'],'2026-03-10','2026-05-15','Automation','$48,000','$0','Multi-system workflow automation with AI routing.',ARRAY['Zapier competition'],ARRAY['50% less manual routing']),
  ('p5','Inventory Forecasting','cl5','Build','critical','u3',ARRAY['u1','u2','u4'],'2026-02-01','2026-04-01','AI + Automation','$72,000','$36,000','ML demand forecasting and automated reorder with Shopify integration.',ARRAY['Shopify API rate limits','Model accuracy'],ARRAY['40% fewer stockouts','90% reorder accuracy']),
  ('p6','Voice AI Agent','cl6','Lead','healthy','u5',ARRAY['u5'],'—','—','AI Agent','TBD','$0','AI phone agent for property inquiries and scheduling.',ARRAY[]::TEXT[],ARRAY['80% call qualification','Auto scheduling']);

-- TASKS
INSERT INTO tasks (id, project_id, title, status, priority, owner, due_date, estimated_hours, actual_hours) VALUES
  -- p1
  ('t1','p1','Design conversation flows','done','high','u1','2026-03-20',16,14),
  ('t2','p1','Build RAG pipeline','in-progress','urgent','u1','2026-03-28',24,18),
  ('t3','p1','HIPAA compliance audit','todo','high','u3','2026-04-05',12,0),
  ('t4','p1','EMR integration layer','todo','medium','u4','2026-04-10',20,0),
  -- p2
  ('t5','p2','CRM data migration','done','high','u4','2026-03-18',16,18),
  ('t6','p2','Lead scoring model','in-progress','urgent','u2','2026-03-25',20,14),
  ('t7','p2','Email sequence builder','in-progress','medium','u4','2026-03-30',16,8),
  ('t8','p2','Analytics dashboard','backlog','medium','u4','2026-04-08',20,0),
  -- p3
  ('t9','p3','OCR pipeline','done','high','u1','2026-03-10',12,10),
  ('t10','p3','Clause extraction','done','urgent','u1','2026-03-18',24,22),
  ('t11','p3','Client UAT','in-progress','high','u4','2026-03-28',8,4),
  -- p4
  ('t13','p4','Requirements doc','done','high','u3','2026-03-15',8,6),
  ('t14','p4','Architecture proposal','in-progress','high','u2','2026-03-27',12,6),
  -- p5
  ('t15','p5','Historical data ETL','done','high','u4','2026-03-12',12,14),
  ('t16','p5','Forecasting model','in-progress','urgent','u1','2026-03-26',24,18),
  ('t17','p5','Shopify API integration','blocked','urgent','u4','2026-03-24',16,10),
  ('t18','p5','Dashboard & alerts','backlog','medium','u2','2026-04-02',16,0);

-- SUBTASKS
INSERT INTO subtasks (id, task_id, title, status, owner, due_date) VALUES
  -- t1 subs
  ('s1','t1','Map intake questions','done','u1','2026-03-15'),
  ('s2','t1','Design fallback logic','done','u1','2026-03-18'),
  ('s3','t1','Multi-language prompt set','done','u5','2026-03-20'),
  -- t2 subs
  ('s4','t2','Vectorize medical KB','done','u1','2026-03-22'),
  ('s5','t2','Retrieval + re-ranking','in-progress','u1','2026-03-26'),
  ('s6','t2','Response guardrails','todo','u1','2026-03-28'),
  -- t3 subs
  ('s7','t3','Complete BAA docs','todo','u3','2026-04-01'),
  ('s8','t3','Security assessment','todo','u4','2026-04-03'),
  -- t5 subs
  ('s9','t5','Export Salesforce data','done','u4','2026-03-14'),
  ('s10','t5','Import to staging','done','u4','2026-03-18'),
  -- t6 subs
  ('s11','t6','Model training + validation','in-progress','u2','2026-03-24'),
  -- t11 subs
  ('s12','t11','Run 50-contract test','in-progress','u4','2026-03-27'),
  ('s13','t11','Client sign-off','todo','u3','2026-03-28'),
  -- t17 subs
  ('s14','t17','Bulk product sync','blocked','u4','2026-03-22'),
  ('s15','t17','Inventory webhook listener','todo','u4','2026-03-24');

-- FILES
INSERT INTO files (subtask_id, name, file_type, size, uploaded_by, uploaded_date) VALUES
  ('s1','intake-flow-v3.pdf','pdf','2.4 MB','u1','Mar 14'),
  ('s2','fallback-logic.json','json','48 KB','u1','Mar 17'),
  ('s3','prompts-en-es-fr.md','md','124 KB','u5','Mar 19'),
  ('s3','review.loom','loom','—','u5','Mar 20'),
  ('s4','embedding-config.yaml','yaml','3.2 KB','u1','Mar 21'),
  ('s6','guardrails-spec.pdf','pdf','890 KB','u3','Mar 20'),
  ('s9','sf-export.csv','csv','1.8 MB','u4','Mar 13'),
  ('s10','migration-report.pdf','pdf','340 KB','u4','Mar 18'),
  ('s12','test-results.xlsx','xlsx','2.1 MB','u4','Mar 25'),
  ('s14','rate-limit-analysis.md','md','8 KB','u4','Mar 22'),
  ('s14','error-logs.json','json','156 KB','u4','Mar 23');

-- COMMENTS
INSERT INTO comments (subtask_id, author, text, time) VALUES
  ('s1','u3','Approved by client. Moving to build.','Mar 15, 2:30 PM'),
  ('s3','u5','French prompts reviewed by native speaker. All clear.','Mar 20, 11:15 AM'),
  ('s5','u1','94% accuracy. Edge cases on medication interactions need work.','Today, 9:45 AM'),
  ('s10','u4','12,847 records migrated. 23 dupes resolved.','Mar 18, 4:00 PM'),
  ('s11','u2','Need more data. Accuracy at 78%, target 85%.','Today'),
  ('s12','u4','48/50 passed. 2 edge cases on amendments.','Yesterday, 3:15 PM'),
  ('s14','u4','429s after ~2000 calls. Need bulk export workaround.','Today, 8:20 AM'),
  ('s14','u3','Escalated. Client contacting Shopify support.','Today, 9:00 AM');

-- ACTIVITY
INSERT INTO activity (project_id, type, text, when_text) VALUES
  ('p1','task','Vraj completed ''Design conversation flows''','2h ago'),
  ('p1','comment','Diya: Client approved flows','2h ago'),
  ('p1','stage','Stage → Build','3d ago'),
  ('p2','comment','Sahil: Need more training data','4h ago'),
  ('p2','status','Health → At Risk','6h ago'),
  ('p3','task','Risk scoring marked complete','1d ago'),
  ('p5','status','Health → Critical','6h ago'),
  ('p5','issue','Shopify blocker escalated','6h ago');

-- DELIVERABLES
INSERT INTO deliverables (project_id, name, type, status, owner, version) VALUES
  ('p1','Intake Chatbot v1.0','AI Agent','in-progress','u1','0.8'),
  ('p1','EMR Integration','API','not-started','u4','—'),
  ('p2','Lead Scoring Engine','AI Model','in-progress','u2','0.4'),
  ('p3','Contract Analyzer v1.0','AI Agent','in-review','u1','1.0-rc1');

-- AUTOMATIONS
INSERT INTO automations (project_id, name, platform, status, owner) VALUES
  ('p1','Patient Intake Flow','Python','in-dev','u1'),
  ('p1','Appt Scheduler','n8n','planned','u2'),
  ('p2','Lead Scoring Pipeline','Python + Supabase','in-dev','u2'),
  ('p3','Contract Processing','Python + Azure','deployed','u1'),
  ('p5','Demand Forecast Engine','Python + Supabase','in-dev','u1');

-- ISSUES
INSERT INTO issues (project_id, title, type, severity, owner, status) VALUES
  ('p1','EMR API rate limit uncertainty','risk','medium','u4','open'),
  ('p2','Client data export 2wk delayed','client delay','high','u3','open'),
  ('p2','Lead scoring below target','risk','medium','u2','open'),
  ('p5','Shopify API rate limits blocking sync','blocker','critical','u4','open'),
  ('p5','Forecast accuracy 87% (target 90%)','risk','medium','u1','open');
