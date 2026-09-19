# User Study

- Document ID: 17evXNudLYIJUEA7I-_jm1LN_aSO9k7VSv12ThrQcIH8
- Revision ID: ANLCKQmcs3Fvm12dXMSqL3ac6sYxz9pQj55khDAY3zIcscthPdEBJovUkZ4R9GY3ERUL7vfhq57OhvOrlPbEkJPei7rCcl2YQvnHKbi7aA
- Selected tab: all
- Protected controls: 0
- Opaque controls: 0
- Authoritative dropdowns: 0

Protected-control annotations are preservation instructions. Do not insert their displayed placeholder text to recreate a native control.

## Protocol (t.ai03zlqxc07q)

[P00001 | 1:21 | NORMAL_TEXT]
User Study Protocol

[P00002 | 21:348 | NORMAL_TEXT]
Study summary: The study evaluates whether the order in which information is presented in an image description affects what blind and low-vision participants understand about the image, how confidently they can recall the spatial layout of the scene, how much effort the task requires, and which description style they prefer.

[P00003 | 348:369 | HEADING_1]
1. Purpose and scope

[P00004 | 369:768 | NORMAL_TEXT]
This study compares four ways of ordering the same kind of image information. Participants do not need to inspect the source image. They listen to descriptions, answer questions about what they understood, and later compare several descriptions of the same image. The study is intended for blind and low-vision participants and is run through a keyboard- and screen-reader-accessible web interface.

[P00005 | 768:804 | NORMAL_TEXT]
The study addresses four questions:

[P00006 | 804:915 | NORMAL_TEXT | LIST id=kix.ayki6fj75qfq level=0]
Does ordering strategy affect gist, recall, and understanding of spatial relationships between scene elements?

[P00007 | 915:997 | NORMAL_TEXT | LIST id=kix.ayki6fj75qfq level=0]
Do the effects change when an image is low, medium, or high in visual complexity?

[P00008 | 997:1118 | NORMAL_TEXT | LIST id=kix.ayki6fj75qfq level=0]
Which ordering strategy helps participants form the clearest mental representation with the least effort or frustration?

[P00009 | 1118:1206 | NORMAL_TEXT | LIST id=kix.ayki6fj75qfq level=0]
Which ordering strategy do participants prefer when they can compare all four versions?

[P00010 | 1206:1526 | NORMAL_TEXT]
The current design combines two parts. In the comprehension part, each participant hears one description per image. In the preference part, each participant hears all four descriptions for the same image and ranks them. Together, these parts provide performance, self-report, workload, behavior, and preference insights

[P00011 | 1526:1552 | HEADING_1]
2. Description conditions

[P00012 | 1552:1714 | NORMAL_TEXT]
Each image has three description versions. The versions should contain comparable core facts; the intended difference is how those facts are ordered and grouped.

[P00013 | 1714:1755 | NORMAL_TEXT]
Table 1. Description-ordering conditions

[P00014 | 1758:1768 | NORMAL_TEXT | TABLE row=0 col=0]
Condition

[P00015 | 1769:1802 | NORMAL_TEXT | TABLE row=0 col=1]
Ordering rule used in this study

[P00016 | 1804:1813 | NORMAL_TEXT | TABLE row=1 col=0]
Baseline

[P00017 | 1814:1885 | NORMAL_TEXT | TABLE row=1 col=1]
No explicit ordering constraint; serves as the comparison description.

[P00018 | 1887:1903 | NORMAL_TEXT | TABLE row=2 col=0]
Spatial (Depth)

[P00019 | 1904:2014 | NORMAL_TEXT | TABLE row=2 col=1]
Presents elements using a spatial progression, described in the project as foreground-to-background ordering.

[P00020 | 2016:2027 | NORMAL_TEXT | TABLE row=3 col=0]
Spatial 2D

[P00021 | 2028:2128 | NORMAL_TEXT | TABLE row=3 col=1]
Organizes information by position in the image frame, using two-dimensional directions and regions.

[P00022 | 2129:2130 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00023 | 2130:2409 | NORMAL_TEXT]
Description control: Before the study is launched, the three versions for each image are checked for factual equivalence and a similar level of detail. Otherwise, a difference attributed to ordering may actually be caused by missing facts, contradictions, or description length.

[P00024 | 2409:2425 | HEADING_1]
3. Study design

[P00025 | 2425:2490 | NORMAL_TEXT | LIST id=kix.uvt5r43hq3nl level=0]
Three description conditions: Baseline, Spatial, and Spatial 2D.

[P00026 | 2490:2575 | NORMAL_TEXT | LIST id=kix.uvt5r43hq3nl level=0]
Twenty comprehension images: five images under each condition for every participant.

[P00027 | 2575:2648 | NORMAL_TEXT | LIST id=kix.uvt5r43hq3nl level=0]
Three preference images: 1 low-, 1 medium-, and 1 high-complexity image.

[P00028 | 2648:2764 | NORMAL_TEXT | LIST id=kix.uvt5r43hq3nl level=0]
4 participant sequence groups (A-D) are counterbalanced to ensure which condition is used with each five-image set.

[P00029 | 2764:2877 | NORMAL_TEXT | LIST id=kix.uvt5r43hq3nl level=0]
The 20 comprehension images are shuffled once for each participant, and the order is saved for session recovery.

[P00030 | 2877:3001 | NORMAL_TEXT | LIST id=kix.uvt5r43hq3nl level=0]
In a comprehension trial, the description may be played once and replayed once. In a preference trial, replay is unlimited.

[P00031 | 3001:3048 | NORMAL_TEXT | LIST id=kix.uvt5r43hq3nl level=0]
Condition names are not shown to participants.

[P00032 | 3048:3075 | HEADING_1]
4. How images are selected

[P00033 | 3075:3106 | HEADING_2]
4.1 Current stimulus inventory

[P00034 | 3106:3326 | NORMAL_TEXT]
The current file contains 23 images: 20 for comprehension and 3 for preference. Records store source and image identifiers, complexity, four descriptions, target elements, a gist prompt, and available spatial questions.

[P00035 | 3326:3362 | NORMAL_TEXT]
Table 2. Current complexity balance

[P00036 | 3365:3376 | NORMAL_TEXT | TABLE row=0 col=0]
Study role

[P00037 | 3377:3381 | NORMAL_TEXT | TABLE row=0 col=1]
Low

[P00038 | 3382:3389 | NORMAL_TEXT | TABLE row=0 col=2]
Medium

[P00039 | 3390:3395 | NORMAL_TEXT | TABLE row=0 col=3]
High

[P00040 | 3396:3402 | NORMAL_TEXT | TABLE row=0 col=4]
Total

[P00041 | 3404:3418 | NORMAL_TEXT | TABLE row=1 col=0]
Comprehension

[P00042 | 3419:3421 | NORMAL_TEXT | TABLE row=1 col=1]
7

[P00043 | 3422:3424 | NORMAL_TEXT | TABLE row=1 col=2]
7

[P00044 | 3425:3427 | NORMAL_TEXT | TABLE row=1 col=3]
6

[P00045 | 3428:3431 | NORMAL_TEXT | TABLE row=1 col=4]
20

[P00046 | 3433:3444 | NORMAL_TEXT | TABLE row=2 col=0]
Preference

[P00047 | 3445:3447 | NORMAL_TEXT | TABLE row=2 col=1]
1

[P00048 | 3448:3450 | NORMAL_TEXT | TABLE row=2 col=2]
1

[P00049 | 3451:3453 | NORMAL_TEXT | TABLE row=2 col=3]
1

[P00050 | 3454:3456 | NORMAL_TEXT | TABLE row=2 col=4]
3

[P00051 | 3457:3458 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00052 | 3458:3746 | NORMAL_TEXT]
Among the 20 comprehension images, the recorded scores range from 0.5370 to 0.6531 for low complexity, 0.6909 to 0.7110 for medium complexity, and 0.7506 to 0.7773 for high complexity. These are the ranges in the selected set; they are not documented thresholds for the full source pool.

[P00053 | 3746:3911 | NORMAL_TEXT]
Complexity score = 0.35 × element count + 0.25 × spatial spread + 0.20 × traversal path length + 0.15 × agent/action density + 0.05 × background/layering complexity

[P00054 | 3911:3939 | HEADING_2]
4.2 Current five-image sets

[P00055 | 3939:4069 | NORMAL_TEXT]
The 20 comprehension images are divided into four fixed sets. The sets are used for counterbalancing, not for presentation order.

[P00056 | 4069:4123 | NORMAL_TEXT]
Table 3. Complexity mix within each comprehension set

[P00057 | 4126:4136 | NORMAL_TEXT | TABLE row=0 col=0]
Image set

[P00058 | 4137:4141 | NORMAL_TEXT | TABLE row=0 col=1]
Low

[P00059 | 4142:4149 | NORMAL_TEXT | TABLE row=0 col=2]
Medium

[P00060 | 4150:4155 | NORMAL_TEXT | TABLE row=0 col=3]
High

[P00061 | 4156:4169 | NORMAL_TEXT | TABLE row=0 col=4]
Total Images

[P00062 | 4171:4177 | NORMAL_TEXT | TABLE row=1 col=0]
Set 1

[P00063 | 4178:4180 | NORMAL_TEXT | TABLE row=1 col=1]
2

[P00064 | 4181:4183 | NORMAL_TEXT | TABLE row=1 col=2]
2

[P00065 | 4184:4186 | NORMAL_TEXT | TABLE row=1 col=3]
1

[P00066 | 4187:4189 | NORMAL_TEXT | TABLE row=1 col=4]
5

[P00067 | 4191:4197 | NORMAL_TEXT | TABLE row=2 col=0]
Set 2

[P00068 | 4198:4200 | NORMAL_TEXT | TABLE row=2 col=1]
2

[P00069 | 4201:4203 | NORMAL_TEXT | TABLE row=2 col=2]
1

[P00070 | 4204:4206 | NORMAL_TEXT | TABLE row=2 col=3]
2

[P00071 | 4207:4209 | NORMAL_TEXT | TABLE row=2 col=4]
5

[P00072 | 4211:4217 | NORMAL_TEXT | TABLE row=3 col=0]
Set 3

[P00073 | 4218:4220 | NORMAL_TEXT | TABLE row=3 col=1]
1

[P00074 | 4221:4223 | NORMAL_TEXT | TABLE row=3 col=2]
2

[P00075 | 4224:4226 | NORMAL_TEXT | TABLE row=3 col=3]
2

[P00076 | 4227:4229 | NORMAL_TEXT | TABLE row=3 col=4]
5

[P00077 | 4231:4237 | NORMAL_TEXT | TABLE row=4 col=0]
Set 4

[P00078 | 4238:4240 | NORMAL_TEXT | TABLE row=4 col=1]
2

[P00079 | 4241:4243 | NORMAL_TEXT | TABLE row=4 col=2]
2

[P00080 | 4244:4246 | NORMAL_TEXT | TABLE row=4 col=3]
1

[P00081 | 4247:4249 | NORMAL_TEXT | TABLE row=4 col=4]
5

[P00082 | 4250:4251 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00083 | 4251:4509 | NORMAL_TEXT]
This distribution gives every participant five images per condition and an approximately balanced mix of complexity levels. Across sequence groups, every set appears under every condition, so set-specific differences are counterbalanced at the sample level.

[P00084 | 4509:4553 | HEADING_1]
5. How participants and images are assigned

[P00085 | 4553:4599 | HEADING_2]
5.1 Assigning participants to sequence groups

[P00086 | 4599:4840 | NORMAL_TEXT]
The application requires us to choose Group A, B, C, or D. It does not assign a group automatically. We will prepare the assignment list before recruitment using randomized blocks of four, with one A, one B, one C, and one D in each block. 

[P00087 | 4840:4879 | HEADING_2]
5.2 Assigning conditions to image sets

[P00088 | 4879:5123 | NORMAL_TEXT]
The participant's sequence group maps each five-image set to one condition. This ensures that every participant receives all four conditions, five images per condition, without hearing more than one description of the same comprehension image.

[P00089 | 5123:5180 | NORMAL_TEXT]
Table 4. Counterbalancing matrix used by the application

[P00090 | 5183:5189 | NORMAL_TEXT | TABLE row=0 col=0]
Group

[P00091 | 5190:5196 | NORMAL_TEXT | TABLE row=0 col=1]
Set 1

[P00092 | 5197:5203 | NORMAL_TEXT | TABLE row=0 col=2]
Set 2

[P00093 | 5204:5210 | NORMAL_TEXT | TABLE row=0 col=3]
Set 3

[P00094 | 5211:5217 | NORMAL_TEXT | TABLE row=0 col=4]
Set 4

[P00095 | 5219:5221 | NORMAL_TEXT | TABLE row=1 col=0]
A

[P00096 | 5222:5231 | NORMAL_TEXT | TABLE row=1 col=1]
Baseline

[P00097 | 5232:5240 | NORMAL_TEXT | TABLE row=1 col=2]
Spatial

[P00098 | 5241:5250 | NORMAL_TEXT | TABLE row=1 col=3]
Semantic

[P00099 | 5251:5262 | NORMAL_TEXT | TABLE row=1 col=4]
Spatial 2D

[P00100 | 5264:5266 | NORMAL_TEXT | TABLE row=2 col=0]
B

[P00101 | 5267:5275 | NORMAL_TEXT | TABLE row=2 col=1]
Spatial

[P00102 | 5276:5287 | NORMAL_TEXT | TABLE row=2 col=2]
Spatial 2D

[P00103 | 5288:5297 | NORMAL_TEXT | TABLE row=2 col=3]
Baseline

[P00104 | 5298:5307 | NORMAL_TEXT | TABLE row=2 col=4]
Semantic

[P00105 | 5309:5311 | NORMAL_TEXT | TABLE row=3 col=0]
C

[P00106 | 5312:5321 | NORMAL_TEXT | TABLE row=3 col=1]
Semantic

[P00107 | 5322:5331 | NORMAL_TEXT | TABLE row=3 col=2]
Baseline

[P00108 | 5332:5343 | NORMAL_TEXT | TABLE row=3 col=3]
Spatial 2D

[P00109 | 5344:5352 | NORMAL_TEXT | TABLE row=3 col=4]
Spatial

[P00110 | 5354:5356 | NORMAL_TEXT | TABLE row=4 col=0]
D

[P00111 | 5357:5368 | NORMAL_TEXT | TABLE row=4 col=1]
Spatial 2D

[P00112 | 5369:5378 | NORMAL_TEXT | TABLE row=4 col=2]
Semantic

[P00113 | 5379:5387 | NORMAL_TEXT | TABLE row=4 col=3]
Spatial

[P00114 | 5388:5397 | NORMAL_TEXT | TABLE row=4 col=4]
Baseline

[P00115 | 5398:5399 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00116 | 5399:5427 | HEADING_2]
5.3 Randomizing image order

[P00117 | 5427:5553 | NORMAL_TEXT | LIST id=kix.1bt1ochdtotf level=0]
At the start of the real study, the application shuffles all 20 comprehension image identifiers using a Fisher-Yates shuffle.

[P00118 | 5553:5738 | NORMAL_TEXT | LIST id=kix.1bt1ochdtotf level=0]
The set-to-condition mapping does not change when the images are shuffled. The display position, image identifier, set, complexity level, and condition are recorded for every response.

[P00119 | 5738:5778 | HEADING_2]
5.4 Randomizing preference descriptions

[P00120 | 5778:6129 | NORMAL_TEXT]
For each preference image, the application independently shuffles the four conditions and labels the resulting descriptions A, B, C, and D. Participants see only the neutral labels. The saved response records the hidden condition behind each label, its display position, playback events, replay counts, best choice, complete ranking, and explanation.

[P00121 | 6129:6150 | HEADING_1]
6. Session procedure

[P00122 | 6150:6184 | HEADING_2]
6.1 Before the participant starts

[P00123 | 6184:6343 | NORMAL_TEXT | LIST id=kix.8znbaqgmmjvl level=0]
Complete consent and any institution-required eligibility or privacy procedure outside the application. The current interface does not contain a consent form.

[P00124 | 6343:6457 | NORMAL_TEXT | LIST id=kix.8znbaqgmmjvl level=0]
Open the study in a supported browser and check the screen reader, keyboard navigation, audio output, and volume.

[P00125 | 6457:6539 | NORMAL_TEXT | LIST id=kix.8znbaqgmmjvl level=0]
Enter a study ID that does not contain the participant's name or contact details.

[P00126 | 6539:6600 | NORMAL_TEXT | LIST id=kix.8znbaqgmmjvl level=0]
Select the next group from the prepared A-D assignment list.

[P00127 | 6600:6716 | NORMAL_TEXT | LIST id=kix.8znbaqgmmjvl level=0]
Record vision background, screen-reader use, and prior image-description experience as provided by the participant.

[P00128 | 6716:6745 | HEADING_2]
6.2 Audio setup and practice

[P00129 | 6745:6852 | NORMAL_TEXT | LIST id=kix.jns8gt3f2bnz level=0]
Play the sample description and let the participant choose 0.75x, 1.0x, 1.25x, 1.5x, 1.75x, or 2.0x speed.

[P00130 | 6852:6964 | NORMAL_TEXT | LIST id=kix.jns8gt3f2bnz level=0]
Run the practice trial at the selected speed. The participant may use one replay and enter a practice response.

[P00131 | 6964:7071 | NORMAL_TEXT | LIST id=kix.jns8gt3f2bnz level=0]
Confirm that the voice, speed, and volume are comfortable. Return to audio settings if a change is needed.

[P00132 | 7071:7150 | NORMAL_TEXT | LIST id=kix.jns8gt3f2bnz level=0]
Start the user study. The selected speed remains fixed during the real trials.

[P00133 | 7150:7187 | HEADING_2]
6.3 Comprehension trials (20 images)

[P00134 | 7187:7261 | NORMAL_TEXT]
For each randomized image, the participant completes the following steps:

[P00135 | 7261:7450 | NORMAL_TEXT | LIST id=kix.rl7gnchgs02s level=0]
Listen to the image description. The participant must let it finish before answering any questions. One replay is allowed; Pausing or changing the speed are not available during the trial.

[P00136 | 7450:7492 | NORMAL_TEXT | LIST id=kix.rl7gnchgs02s level=0]
Answer the open-ended main-idea question.

[P00137 | 7492:7547 | NORMAL_TEXT | LIST id=kix.rl7gnchgs02s level=0]
Describe the scene in their own words for free recall.

[P00138 | 7547:7586 | NORMAL_TEXT | LIST id=kix.rl7gnchgs02s level=0]
Answer the spatial-relation questions.

[P00139 | 7586:7752 | NORMAL_TEXT | LIST id=kix.rl7gnchgs02s level=0]
Rate overall scene clarity, confidence in understanding spatial relationships, and understanding of the main subject and actions on five-point optimal rating scales.

[P00140 | 7752:7812 | NORMAL_TEXT | LIST id=kix.rl7gnchgs02s level=0]
Rate mental demand, effort, and frustration for that image.

[P00141 | 7812:7873 | NORMAL_TEXT | LIST id=kix.rl7gnchgs02s level=0]
Save the response and continue to the next randomized image.

[P00142 | 7873:7906 | HEADING_2]
6.4 Preference trials (3 images)

[P00143 | 7906:8013 | NORMAL_TEXT]
The participant completes one low-, one medium-, and one high-complexity preference image. For each image:

[P00144 | 8013:8101 | NORMAL_TEXT | LIST id=kix.1n3u8jqvto01 level=0]
Listen to Descriptions A-D. They may be played in any order and replayed without limit.

[P00145 | 8101:8150 | NORMAL_TEXT | LIST id=kix.1n3u8jqvto01 level=0]
Listen to all four before submitting a response.

[P00146 | 8150:8198 | NORMAL_TEXT | LIST id=kix.1n3u8jqvto01 level=0]
Choose the single description that helped most.

[P00147 | 8198:8268 | NORMAL_TEXT | LIST id=kix.1n3u8jqvto01 level=0]
Rank all four descriptions from best to worst, using each label once.

[P00148 | 8268:8320 | NORMAL_TEXT | LIST id=kix.1n3u8jqvto01 level=0]
Explain the ranking in the participant's own words.

[P00149 | 8320:8543 | NORMAL_TEXT]
The current interface also displays the text of each preference description. If the study is intended to be audio-only, we can remove the visible text or state in the final protocol that access to text is part of the task.

[P00150 | 8543:8586 | HEADING_2]
6.5 Semi-structured interview and closeout

[P00151 | 8586:8976 | NORMAL_TEXT]
The interface presents seven interview prompts covering helpful description features, ordering strategy, spatial detail, semantic grouping, missing orientation details, length, and real-world preference. We should ask the prompts consistently and record the responses in an approved notes or recording system. The current interface displays the prompts but does not save interview answers.

[P00152 | 8976:9065 | NORMAL_TEXT | LIST id=kix.ahcaflbcw4sd level=0]
Review the completion counts: 20 comprehension responses and three preference responses.

[P00153 | 9065:9148 | NORMAL_TEXT | LIST id=kix.ahcaflbcw4sd level=0]
Use Save result and confirm that the Firestore save returns a document identifier.

[P00154 | 9148:9331 | NORMAL_TEXT | LIST id=kix.ahcaflbcw4sd level=0]
Follow the study's backup/export procedure before clearing the session. The code contains CSV/JSON export functions, but the current completion screen does not expose export buttons.

[P00155 | 9331:9407 | NORMAL_TEXT | LIST id=kix.ahcaflbcw4sd level=0]
Clear the local session only after the save and backup checks are complete.

[P00156 | 9407:9437 | HEADING_1]
7. Measures and recorded data

[P00157 | 9440:9445 | NORMAL_TEXT | TABLE row=0 col=0]
Area

[P00158 | 9446:9454 | NORMAL_TEXT | TABLE row=0 col=1]
Measure

[P00159 | 9455:9473 | NORMAL_TEXT | TABLE row=0 col=2]
How it is handled

[P00160 | 9475:9489 | NORMAL_TEXT | TABLE row=1 col=0]
Comprehension

[P00161 | 9490:9516 | NORMAL_TEXT | TABLE row=1 col=1]
Main idea and free recall

[P00162 | 9517:9579 | NORMAL_TEXT | TABLE row=1 col=2]
Open-ended text; code after the study using a written rubric.

[P00163 | 9581:9603 | NORMAL_TEXT | TABLE row=2 col=0]
Spatial understanding

[P00164 | 9604:9630 | NORMAL_TEXT | TABLE row=2 col=1]
Spatial-question accuracy

[P00165 | 9631:9697 | NORMAL_TEXT | TABLE row=2 col=2]
Yes or no responses, coded as 1 for correct and 0 for incorrect. 

[P00166 | 9699:9710 | NORMAL_TEXT | TABLE row=3 col=0]
Experience

[P00167 | 9711:9768 | NORMAL_TEXT | TABLE row=3 col=1]
Scene clarity, spatial confidence, content understanding

[P00168 | 9769:9826 | NORMAL_TEXT | TABLE row=3 col=2]
Three five-point optimal rating scale  after each image.

[P00169 | 9828:9837 | NORMAL_TEXT | TABLE row=4 col=0]
Workload

[P00170 | 9838:9873 | NORMAL_TEXT | TABLE row=4 col=1]
Mental demand, effort, frustration

[P00171 | 9874:9917 | NORMAL_TEXT | TABLE row=4 col=2]
Three five-point ratings after each image.

[P00172 | 9919:9930 | NORMAL_TEXT | TABLE row=5 col=0]
Preference

[P00173 | 9931:9960 | NORMAL_TEXT | TABLE row=5 col=1]
Best choice and full ranking

[P00174 | 9961:10010 | NORMAL_TEXT | TABLE row=5 col=2]
Saved with the hidden condition mapping for A-D.

[P00175 | 10012:10024 | NORMAL_TEXT | TABLE row=6 col=0]
Explanation

[P00176 | 10025:10055 | NORMAL_TEXT | TABLE row=6 col=1]
Reason for preference ranking

[P00177 | 10056:10103 | NORMAL_TEXT | TABLE row=6 col=2]
Audio transcription for each preference image.

[P00178 | 10105:10114 | NORMAL_TEXT | TABLE row=7 col=0]
Behavior

[P00179 | 10115:10138 | NORMAL_TEXT | TABLE row=7 col=1]
Replay and timing data

[P00180 | 10139:10202 | NORMAL_TEXT | TABLE row=7 col=2]
Play events, replay count, response time, and step timestamps.

[P00181 | 10204:10212 | NORMAL_TEXT | TABLE row=8 col=0]
Context

[P00182 | 10213:10245 | NORMAL_TEXT | TABLE row=8 col=1]
Participant and stimulus fields

[P00183 | 10246:10338 | NORMAL_TEXT | TABLE row=8 col=2]
Sequence group, audio speed, image ID, set, complexity, condition, and randomized position.

[P00184 | 10339:10340 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00185 | 10340:10682 | NORMAL_TEXT]
Open-ended gist responses currently do not produce an automatic score because the expected answer is recorded as an instruction to code later, not as a selectable answer. Use a prewritten coding rubric, train at least two coders on a subset, and resolve disagreements without exposing the description condition during coding where practical.

[P00186 | 10682:10691 | HEADING_1]
9. Todos

[P00187 | 10691:10727 | NORMAL_TEXT | LIST id=kix.dqjdsm9saq80 level=0]
Complete the spatial question set. 

[P00188 | 10727:10857 | NORMAL_TEXT | LIST id=kix.dqjdsm9saq80 level=0]
Decide the preference modality. The interface plays audio and displays the description text. Confirm whether that is intentional.

[P00189 | 10857:10864 | NORMAL_TEXT | LIST id=kix.dqjdsm9saq80 level=0]
Break?

[P00190 | 10864:10901 | NORMAL_TEXT | LIST id=kix.dqjdsm9saq80 level=0]
Semi-structured interview questions.

[P00191 | 10901:10936 | NORMAL_TEXT | LIST id=kix.dqjdsm9saq80 level=0]
Free recall & Main idea questions?

[P00192 | 10936:10937 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

## User Study Design & Procedure (t.0)

[P00193 | 1:88 | HEADING_1]
BLV User Study Plan: Comparing Scene Element Ordering Strategies for Image Narratives 

[P00194 | 88:102 | HEADING_2]
1. Study Goal

[P00195 | 102:267 | NORMAL_TEXT]
This study evaluates how different scene element ordering strategies affect blind and low vision users’ understanding and preference of generated image narratives. 

[P00196 | 267:302 | NORMAL_TEXT]
The three ordering conditions are:

[P00197 | 302:364 | NORMAL_TEXT | LIST id=kix.ynza46ikcakc level=0]
Baseline: No explicit ordering constraint (Control condition)

[P00198 | 364:449 | NORMAL_TEXT | LIST id=kix.ynza46ikcakc level=0]
Spatial ordering: Depth ordering →(Best performing in terms of SAC and NDC measures)

[P00199 | 449:529 | NORMAL_TEXT | LIST id=kix.ynza46ikcakc level=0]
Semantic ordering: Ordering based on semantic relationships (Control Condition)

[P00200 | 529:751 | NORMAL_TEXT]
The main goal is to understand whether spatial ordering, semantic ordering, or no-order baseline produces narratives that better support image comprehension, spatial understanding, subjective clarity, and user preference.

[P00201 | 751:776 | HEADING_2]
2. Study Design Overview

[P00202 | 776:825 | NORMAL_TEXT | LIST id=kix.9to392heyh7 level=0]
Participants: 10–15 BLV participants (Niko: 12+)

[P00203 | 825:864 | NORMAL_TEXT | LIST id=kix.9to392heyh7 level=0]
Design: Mixed repeated-measures design

[P00204 | 864:922 | NORMAL_TEXT | LIST id=kix.9to392heyh7 level=0]
Conditions: Baseline, spatial ordering, semantic ordering

[P00205 | 922:1006 | NORMAL_TEXT | LIST id=kix.9to392heyh7 level=0]
Complexity control: Images are grouped into low, medium, and high complexity levels

[P00206 | 1006:1067 | NORMAL_TEXT | LIST id=kix.9to392heyh7 level=0]
Main task: Comprehension task with one description per image

[P00207 | 1067:1165 | NORMAL_TEXT | LIST id=kix.9to392heyh7 level=0]
Secondary task (optional): Preference task with same-image comparison across all three conditions

[P00208 | 1165:1324 | NORMAL_TEXT | LIST id=kix.9to392heyh7 level=0]
Main outcomes: Comprehension, spatial accuracy, semantic gist, mental image clarity, perceived quality, cognitive load, preference ranking, qualitative themes

[P00209 | 1324:1351 | HEADING_2]
3. Main Comprehension Task

[P00210 | 1351:1391 | NORMAL_TEXT]
Each participant hears 15 descriptions:

[P00211 | 1391:1416 | NORMAL_TEXT | LIST id=kix.myz0gq24cqwy level=0]
Low complexity: 5 images

[P00212 | 1416:1444 | NORMAL_TEXT | LIST id=kix.myz0gq24cqwy level=0]
Medium complexity: 5 images

[P00213 | 1444:1470 | NORMAL_TEXT | LIST id=kix.myz0gq24cqwy level=0]
High complexity: 5 images

[P00214 | 1470:1532 | NORMAL_TEXT]
Each participant hears only one ordering condition per image.

[P00215 | 1532:1769 | NORMAL_TEXT]
This avoids learning the same image from multiple descriptions. For example, if a participant hears the baseline description for Image A, they will not hear the spatial or semantic descriptions for Image A during the comprehension task.

[P00216 | 1769:1939 | NORMAL_TEXT]
This is important because comprehension should measure what the participant can understand from a single narrative, not from repeated exposure to the same image content.

[P00217 | 1939:1964 | HEADING_2]
4. Counterbalancing Plan

[P00218 | 1964:2018 | NORMAL_TEXT]
Use 3 sequence groups based on Latin-square rotation.

[P00219 | 2018:2093 | NORMAL_TEXT]
Each image is assigned to one of the three conditions across participants:

[P00220 | 2096:2111 | NORMAL_TEXT | TABLE row=0 col=0]
Sequence group

[P00221 | 2112:2132 | NORMAL_TEXT | TABLE row=0 col=1]
Image Set 1 (5imgs)

[P00222 | 2133:2145 | NORMAL_TEXT | TABLE row=0 col=2]
Image Set 2

[P00223 | 2146:2158 | NORMAL_TEXT | TABLE row=0 col=3]
Image Set 3

[P00224 | 2160:2168 | NORMAL_TEXT | TABLE row=1 col=0]
Group A

[P00225 | 2169:2178 | NORMAL_TEXT | TABLE row=1 col=1]
Baseline

[P00226 | 2179:2187 | NORMAL_TEXT | TABLE row=1 col=2]
Spatial

[P00227 | 2188:2197 | NORMAL_TEXT | TABLE row=1 col=3]
Semantic

[P00228 | 2199:2207 | NORMAL_TEXT | TABLE row=2 col=0]
Group B

[P00229 | 2208:2216 | NORMAL_TEXT | TABLE row=2 col=1]
Spatial

[P00230 | 2217:2226 | NORMAL_TEXT | TABLE row=2 col=2]
Semantic

[P00231 | 2227:2236 | NORMAL_TEXT | TABLE row=2 col=3]
Baseline

[P00232 | 2238:2246 | NORMAL_TEXT | TABLE row=3 col=0]
Group C

[P00233 | 2247:2256 | NORMAL_TEXT | TABLE row=3 col=1]
Semantic

[P00234 | 2257:2266 | NORMAL_TEXT | TABLE row=3 col=2]
Baseline

[P00235 | 2267:2275 | NORMAL_TEXT | TABLE row=3 col=3]
Spatial

[P00236 | 2276:2300 | NORMAL_TEXT]
Participant assignment:

[P00237 | 2300:2351 | NORMAL_TEXT | LIST id=kix.df0o1aevesj2 level=0]
12 participants: 4 participants per sequence group

[P00238 | 2351:2402 | NORMAL_TEXT | LIST id=kix.df0o1aevesj2 level=0]
15 participants: 5 participants per sequence group

[P00239 | 2402:2542 | NORMAL_TEXT]
This ensures that each image appears under each condition across participants, while each participant only hears one version of each image.

[P00240 | 2542:2561 | HEADING_2]
5. Preference Task

[P00241 | 2561:2616 | HEADING_2]
Use 3 separate images, one from each complexity level:

[P00242 | 2616:2640 | NORMAL_TEXT | LIST id=kix.7z1o7g7ozkal level=0]
Low complexity: 1 image

[P00243 | 2640:2667 | NORMAL_TEXT | LIST id=kix.7z1o7g7ozkal level=0]
Medium complexity: 1 image

[P00244 | 2667:2692 | NORMAL_TEXT | LIST id=kix.7z1o7g7ozkal level=0]
High complexity: 1 image

[P00245 | 2692:2754 | NORMAL_TEXT]
For each image, the participant hears all three descriptions:

[P00246 | 2754:2763 | NORMAL_TEXT | LIST id=kix.o2so0sanvav7 level=0]
Baseline

[P00247 | 2763:2780 | NORMAL_TEXT | LIST id=kix.o2so0sanvav7 level=0]
Spatial ordering

[P00248 | 2780:2798 | NORMAL_TEXT | LIST id=kix.o2so0sanvav7 level=0]
Semantic ordering

[P00249 | 2798:2846 | NORMAL_TEXT]
The order of presentation should be randomized.

[P00250 | 2846:2960 | NORMAL_TEXT]
After hearing the three descriptions, the participant ranks them from best to worst and explains their reasoning.

[P00251 | 2960:3066 | NORMAL_TEXT]
This task directly answers which ordering strategy BLV users prefer when the image content is controlled.

[P00252 | 3066:3085 | HEADING_2]
6. Trial Procedure

[P00253 | 3085:3118 | HEADING_3]
Step 1: Introduction and Consent

[P00254 | 3118:3208 | NORMAL_TEXT]
Briefly explain the study goal without revealing the expected advantage of any condition.

[P00255 | 3208:3229 | NORMAL_TEXT]
Example explanation:

[P00256 | 3229:3493 | NORMAL_TEXT]
We are studying different ways of organizing image descriptions. You will listen to descriptions of images and answer questions about what you understood. Later, you will compare different descriptions of the same image and tell us which one works better for you.

[P00257 | 3493:3537 | HEADING_3]
Step 2: Demographics and Access Preferences

[P00258 | 3537:3546 | NORMAL_TEXT]
Collect:

[P00259 | 3546:3620 | NORMAL_TEXT | LIST id=kix.dh1j6viukqas level=0]
Vision background: Blind, low vision, legally blind, onset of vision loss

[P00260 | 3620:3711 | NORMAL_TEXT | LIST id=kix.dh1j6viukqas level=0]
Image description experience: Frequency of using alt text, AI descriptions, screen readers

[P00261 | 3711:3774 | NORMAL_TEXT | LIST id=kix.dh1j6viukqas level=0]
Audio preference: Preferred speech speed, voice, replay option

[P00262 | 3774:3842 | NORMAL_TEXT | LIST id=kix.dh1j6viukqas level=0]
Familiarity with visual scenes: Optional, depending on image domain

[P00263 | 3842:3865 | HEADING_3]
Step 3: Practice Trial

[P00264 | 3865:3928 | NORMAL_TEXT]
Use one practice image that is not included in the main study.

[P00265 | 3928:3937 | NORMAL_TEXT]
Purpose:

[P00266 | 3937:3985 | NORMAL_TEXT | LIST id=kix.6bl0xugjb9m5 level=0]
Let participants become familiar with the task.

[P00267 | 3985:4031 | NORMAL_TEXT | LIST id=kix.6bl0xugjb9m5 level=0]
Check whether the audio speed is comfortable.

[P00268 | 4031:4105 | NORMAL_TEXT | LIST id=kix.6bl0xugjb9m5 level=0]
Clarify that they can ask to replay the description if replay is allowed.

[P00269 | 4105:4134 | HEADING_3]
Step 4: Comprehension Trials

[P00270 | 4134:4186 | NORMAL_TEXT]
Each participant completes 15 comprehension trials.

[P00271 | 4186:4202 | NORMAL_TEXT]
For each trial:

[P00272 | 4202:4243 | NORMAL_TEXT | LIST id=kix.ggk8q9m9wiwp level=0]
Participant hears one image description.

[P00273 | 4243:4274 | NORMAL_TEXT | LIST id=kix.ggk8q9m9wiwp level=0]
Participant gives free recall.

[P00274 | 4274:4322 | NORMAL_TEXT | LIST id=kix.ggk8q9m9wiwp level=0]
Participant answers spatial relation questions.

[P00275 | 4322:4368 | NORMAL_TEXT | LIST id=kix.ggk8q9m9wiwp level=0]
Participant answers a semantic gist question.

[P00276 | 4368:4401 | NORMAL_TEXT | LIST id=kix.ggk8q9m9wiwp level=0]
Participant gives short ratings.

[P00277 | 4401:4427 | HEADING_3]
Step 5: Preference Trials

[P00278 | 4427:4475 | NORMAL_TEXT]
Each participant completes 3 preference trials.

[P00279 | 4475:4491 | NORMAL_TEXT]
For each trial:

[P00280 | 4491:4547 | NORMAL_TEXT | LIST id=kix.q5b0fpte4ftz level=0]
Participant hears three descriptions of the same image.

[P00281 | 4547:4605 | NORMAL_TEXT | LIST id=kix.q5b0fpte4ftz level=0]
The three descriptions are presented in randomized order.

[P00282 | 4605:4629 | NORMAL_TEXT | LIST id=kix.q5b0fpte4ftz level=0]
Participant ranks them.

[P00283 | 4629:4687 | NORMAL_TEXT | LIST id=kix.q5b0fpte4ftz level=0]
Participant explains why they preferred one over another.

[P00284 | 4687:4721 | HEADING_3]
Step 6: Semi-Structured Interview

[P00285 | 4721:4752 | NORMAL_TEXT]
Ask follow-up questions about:

[P00286 | 4752:4825 | NORMAL_TEXT | LIST id=kix.ud8p13iezzw9 level=0]
Which description order helped them build the mental image of the scene.

[P00287 | 4825:4854 | NORMAL_TEXT | LIST id=kix.ud8p13iezzw9 level=0]
Anything that was confusing.

[P00288 | 4854:5025 | NORMAL_TEXT | LIST id=kix.ud8p13iezzw9 level=0]
Whether describing the spatial relations between scene elements (Behind the woman, a tall building is drawn in grey) was helpful in understanding the scene's spatial map.

[P00289 | 5025:5173 | NORMAL_TEXT | LIST id=kix.ud8p13iezzw9 level=0]
Whether describing scene elements in relation to the painting frame (the sheep in the bottom left) helpful in understanding the scene's spatial map

[P00290 | 5173:5340 | NORMAL_TEXT | LIST id=kix.ud8p13iezzw9 level=0]
Whether describing the scene elements in relation to the viewer's perspective (to your left, a sheep is eating grass) helpful in understanding the scene's spatial map

[P00291 | 5340:5374 | NORMAL_TEXT | LIST id=kix.ud8p13iezzw9 level=0]
Whether semantic grouping helped.

[P00292 | 5374:5421 | NORMAL_TEXT | LIST id=kix.ud8p13iezzw9 level=0]
What spatial/orientation details were missing.

[P00293 | 5421:5466 | HEADING_2]
7. Why Separate Comprehension and Preference

[P00294 | 5466:5556 | NORMAL_TEXT]
Comprehension and preference should be separated because they answer different questions.

[P00295 | 5556:5643 | NORMAL_TEXT | LIST id=kix.bq7db71x8n4u level=0]
Comprehension task: Measures whether a single description supports image understanding

[P00296 | 5643:5739 | NORMAL_TEXT | LIST id=kix.bq7db71x8n4u level=0]
Preference task: Measures which ordering strategy users prefer when image content is controlled

[P00297 | 5739:5968 | NORMAL_TEXT]
For comprehension, participants should not hear multiple descriptions of the same image. If they hear all three versions, they may build understanding from the combination of descriptions. This would contaminate the measurement.

[P00298 | 5968:6131 | NORMAL_TEXT]
For preference, participants need to compare descriptions of the same image. Same-image comparison controls the image content and isolates the effect of ordering.

[P00299 | 6131:6143 | HEADING_2]
8. Outcomes

[P00300 | 6146:6154 | NORMAL_TEXT | TABLE row=0 col=0]
Outcome

[P00301 | 6155:6172 | NORMAL_TEXT | TABLE row=0 col=1]
What it tells us

[P00302 | 6174:6194 | NORMAL_TEXT | TABLE row=1 col=0]
Comprehension score

[P00303 | 6195:6249 | NORMAL_TEXT | TABLE row=1 col=1]
Whether users understand the described scene elements

[P00304 | 6251:6277 | NORMAL_TEXT | TABLE row=2 col=0]
Spatial relation accuracy

[P00305 | 6278:6330 | NORMAL_TEXT | TABLE row=2 col=1]
Whether users understand where elements are located

[P00306 | 6332:6355 | NORMAL_TEXT | TABLE row=3 col=0]
Semantic gist accuracy

[P00307 | 6356:6407 | NORMAL_TEXT | TABLE row=3 col=1]
Whether users understand the main meaning or event

[P00308 | 6409:6430 | NORMAL_TEXT | TABLE row=4 col=0]
Mental image clarity

[P00309 | 6431:6484 | NORMAL_TEXT | TABLE row=4 col=1]
Whether users can form a clear mental representation

[P00310 | 6486:6502 | NORMAL_TEXT | TABLE row=5 col=0]
Spatial clarity

[P00311 | 6503:6539 | NORMAL_TEXT | TABLE row=5 col=1]
Whether users understand the layout

[P00312 | 6541:6559 | NORMAL_TEXT | TABLE row=6 col=0]
Perceived quality

[P00313 | 6560:6609 | NORMAL_TEXT | TABLE row=6 col=1]
Whether the description feels useful and natural

[P00314 | 6611:6626 | NORMAL_TEXT | TABLE row=7 col=0]
Cognitive load

[P00315 | 6627:6673 | NORMAL_TEXT | TABLE row=7 col=1]
Whether the description is mentally demanding

[P00316 | 6675:6694 | NORMAL_TEXT | TABLE row=8 col=0]
Preference ranking

[P00317 | 6695:6723 | NORMAL_TEXT | TABLE row=8 col=1]
Which ordering users prefer

[P00318 | 6725:6744 | NORMAL_TEXT | TABLE row=9 col=0]
Qualitative themes

[P00319 | 6745:6787 | NORMAL_TEXT | TABLE row=9 col=1]
Why users prefer or dislike each ordering

[P00320 | 6788:6789 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

## Evaluation Measures (t.62w30lbg4vc3)

[P00321 | 1:21 | HEADING_1]
Evaluation Measures

[P00322 | 21:56 | HEADING_2]
1. Semantic Gist Accuracy (static)

[P00323 | 56:75 | NORMAL_TEXT | LIST id=kix.1k26t6jn0got level=0]
Field: Description

[P00324 | 75:112 | NORMAL_TEXT | LIST id=kix.1k26t6jn0got level=0]
When: After each comprehension trial

[P00325 | 112:201 | NORMAL_TEXT | LIST id=kix.1k26t6jn0got level=0]
Question format: “In one or two sentences, describe what is happening in this painting.”

[P00326 | 201:255 | NORMAL_TEXT | LIST id=kix.1k26t6jn0got level=0]
Scoring: Full, partial, no coherent scene identified 

[P00327 | 255:333 | NORMAL_TEXT | LIST id=kix.1k26t6jn0got level=0]
Why useful: Tests whether semantic ordering improves high-level scene meaning

[P00328 | 333:425 | NORMAL_TEXT | LIST id=kix.1k26t6jn0got level=0]
Reference logic: Semantic coherence should help users understand the central scene or event

[P00329 | 425:444 | NORMAL_TEXT]
Suggested scoring:

[P00330 | 444:459 | NORMAL_TEXT | LIST id=kix.en0i9m3u71mm level=0]
Score: Meaning

[P00331 | 459:472 | NORMAL_TEXT | LIST id=kix.en0i9m3u71mm level=0]
1: Full gist

[P00332 | 472:490 | NORMAL_TEXT | LIST id=kix.en0i9m3u71mm level=0]
0.5: Partial gist

[P00333 | 490:523 | NORMAL_TEXT | LIST id=kix.en0i9m3u71mm level=0]
0: No coherent scene identified 

[P00334 | 523:558 | HEADING_2]
Comprehension Free Recall (static)

[P00335 | 558:577 | NORMAL_TEXT | LIST id=kix.a3u76dwx7y3 level=0]
Field: Description

[P00336 | 577:614 | NORMAL_TEXT | LIST id=kix.a3u76dwx7y3 level=0]
When: After each comprehension trial

[P00337 | 614:806 | NORMAL_TEXT | LIST id=kix.a3u76dwx7y3 level=0]
Question: “Describe the scene in your own words. Mention what you remember, including the people or objects present, how they were arranged or related to one another, and what was happening.”

[P00338 | 806:975 | NORMAL_TEXT | LIST id=kix.a3u76dwx7y3 level=0]
Scoring: Score based on the proportion of target scene elements recalled. More than one researcher will separately code the responses to ensure inter-rater reliability.

[P00339 | 975:1057 | NORMAL_TEXT | LIST id=kix.a3u76dwx7y3 level=0]
Why useful: Checks whether the narrative supports a reconstructable mental model.

[P00340 | 1057:1352 | NORMAL_TEXT | LIST id=kix.a3u76dwx7y3 level=0]
Reference logic: Image-description and visualization accessibility studies often ask users to judge whether descriptions support understanding and mental image construction. A proportion-based score is more appropriate here because images may contain different numbers of target scene elements.

[P00341 | 1352:1371 | NORMAL_TEXT]
Suggested scoring 

[P00342 | 1371:1408 | NORMAL_TEXT | LIST id=kix.b9zailk68n3c level=0]
0: No target scene elements recalled

[P00343 | 1408:1459 | NORMAL_TEXT | LIST id=kix.b9zailk68n3c level=0]
1: Half of the target scene elements were recalled

[P00344 | 1459:1511 | NORMAL_TEXT | LIST id=kix.b9zailk68n3c level=0]
2: All or almost all target scene elements recalled

[P00345 | 1511:1660 | NORMAL_TEXT]
Equivalent concepts should count. For example, “person,” “woman,” and “figure” may be treated as equivalent if they refer to the same scene element.

[P00346 | 1660:1740 | NORMAL_TEXT]
If more granularity is needed, we can also compute the exact recall proportion:

[P00347 | 1740:1839 | NORMAL_TEXT]
Recall proportion = number of correctly recalled target elements / total number of target elements

[P00348 | 1839:1840 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00349 | 1840:1924 | NORMAL_TEXT]
Then we can report both the continuous proportion and the simplified 3-level score.

[P00350 | 1924:1960 | HEADING_2]
Spatial Relation Accuracy (dynamic)

[P00351 | 1960:1979 | NORMAL_TEXT | LIST id=kix.4yltxtx1a5ev level=0]
Field: Description

[P00352 | 1979:2016 | NORMAL_TEXT | LIST id=kix.4yltxtx1a5ev level=0]
When: After each comprehension trial

[P00353 | 2016:2099 | NORMAL_TEXT | LIST id=kix.4yltxtx1a5ev level=0]
Question format: Ask 6 short spatial questions using simple forced-choice formats.

[P00354 | 2099:2132 | NORMAL_TEXT | LIST id=kix.4yltxtx1a5ev level=0]
Scoring: Total correct out of 6.

[P00355 | 2132:2289 | NORMAL_TEXT | LIST id=kix.4yltxtx1a5ev level=0]
Why useful: Directly tests whether the description supports spatial understanding, especially whether spatial ordering improves recall of element locations.

[P00356 | 2289:2463 | NORMAL_TEXT | LIST id=kix.4yltxtx1a5ev level=0]
Reference logic: Spatial ordering should improve spatial continuity. This measure can also show which frame of reference is easier for participants to understand and recall.

[P00357 | 2463:2478 | NORMAL_TEXT]
Question Types

[P00358 | 2478:2681 | NORMAL_TEXT]
Each trial includes six spatial questions across three different frames of reference. Each frame of reference is evaluated using two questions. Objects tested are either focal or secondarily important. 

[P00359 | 2681:2682 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00360 | 2685:2704 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00361 | 2705:2722 | NORMAL_TEXT | TABLE row=0 col=1]
Example question

[P00362 | 2723:2730 | NORMAL_TEXT | TABLE row=0 col=2]
Format

[P00363 | 2732:2765 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00364 | 2766:2792 | NORMAL_TEXT | TABLE row=1 col=1]
“Was X to the left of Y?”

[P00365 | 2793:2800 | NORMAL_TEXT | TABLE row=1 col=2]
Yes/no

[P00366 | 2802:2837 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00367 | 2838:2881 | NORMAL_TEXT | TABLE row=2 col=1]
“Was X in the top-left area of the image?”

[P00368 | 2882:2889 | NORMAL_TEXT | TABLE row=2 col=2]
Yes/no

[P00369 | 2890:2908 | NORMAL_TEXT]
Suggested scoring

[P00370 | 2908:2909 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00371 | 2912:2918 | NORMAL_TEXT | TABLE row=0 col=0]
Score

[P00372 | 2919:2927 | NORMAL_TEXT | TABLE row=0 col=1]
Meaning

[P00373 | 2929:2931 | NORMAL_TEXT | TABLE row=1 col=0]
1

[P00374 | 2932:2940 | NORMAL_TEXT | TABLE row=1 col=1]
Correct

[P00375 | 2942:2946 | NORMAL_TEXT | TABLE row=2 col=0]
0.5

[P00376 | 2947:3003 | NORMAL_TEXT | TABLE row=2 col=1]
Partially correct, if the answer is close but imprecise

[P00377 | 3005:3007 | NORMAL_TEXT | TABLE row=3 col=0]
0

[P00378 | 3008:3018 | NORMAL_TEXT | TABLE row=3 col=1]
Incorrect

[P00379 | 3019:3121 | NORMAL_TEXT]
Each trial includes 6 spatial questions, giving a total spatial accuracy score from 0 to 6 per trial.

[P00380 | 3121:3122 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00381 | 3122:3155 | HEADING_2]
4. Mental Image Clarity (static)

[P00382 | 3155:3174 | NORMAL_TEXT | LIST id=kix.l4471xlyefz2 level=0]
Field: Description

[P00383 | 3174:3211 | NORMAL_TEXT | LIST id=kix.l4471xlyefz2 level=0]
When: After each comprehension trial

[P00384 | 3211:3271 | NORMAL_TEXT | LIST id=kix.l4471xlyefz2 level=0]
Question: “I could form a clear mental image of the scene.”

[P00385 | 3271:3303 | NORMAL_TEXT | LIST id=kix.l4471xlyefz2 level=0]
Scale: 1–5 optimal rating scale

[P00386 | 3303:3365 | NORMAL_TEXT | LIST id=kix.l4471xlyefz2 level=0]
Why useful: Captures subjective imageability or imaginability

[P00387 | 3365:3495 | NORMAL_TEXT | LIST id=kix.l4471xlyefz2 level=0]
Reference logic: Prior BLV image-description work has used dimensions such as quality, imaginability, relevance, and plausibility

[P00388 | 3495:3517 | NORMAL_TEXT]
Optimal rating scale:

[P00389 | 3517:3531 | NORMAL_TEXT | LIST id=kix.7pr74dflahhx level=0]
1: Not at all

[P00390 | 3531:3543 | NORMAL_TEXT | LIST id=kix.7pr74dflahhx level=0]
2: Slightly

[P00391 | 3543:3557 | NORMAL_TEXT | LIST id=kix.7pr74dflahhx level=0]
3: Moderately

[P00392 | 3557:3565 | NORMAL_TEXT | LIST id=kix.7pr74dflahhx level=0]
4: Very

[P00393 | 3565:3583 | NORMAL_TEXT | LIST id=kix.7pr74dflahhx level=0]
5: Extremely Well

[P00394 | 3583:3611 | HEADING_2]
5. Spatial Clarity (static)

[P00395 | 3611:3630 | NORMAL_TEXT | LIST id=kix.o41nf8a2l9sz level=0]
Field: Description

[P00396 | 3630:3667 | NORMAL_TEXT | LIST id=kix.o41nf8a2l9sz level=0]
When: After each comprehension trial

[P00397 | 3667:3748 | NORMAL_TEXT | LIST id=kix.o41nf8a2l9sz level=0]
Question: “I understood where the described elements were located in the image.”

[P00398 | 3748:3780 | NORMAL_TEXT | LIST id=kix.o41nf8a2l9sz level=0]
Scale: 1–5 optimal rating scale

[P00399 | 3780:3835 | NORMAL_TEXT | LIST id=kix.o41nf8a2l9sz level=0]
Why useful: Directly maps to spatial narrative quality

[P00400 | 3835:3927 | NORMAL_TEXT | LIST id=kix.o41nf8a2l9sz level=0]
Reference logic: Useful for validating whether NDC-like spatial continuity matters to users

[P00401 | 3927:3928 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00402 | 3928:3950 | NORMAL_TEXT]
Scale same as above. 

[P00403 | 3950:3980 | HEADING_2]
6. Perceived Quality (static)

[P00404 | 3980:3999 | NORMAL_TEXT | LIST id=kix.91uvg5uydp7c level=0]
Field: Description

[P00405 | 3999:4036 | NORMAL_TEXT | LIST id=kix.91uvg5uydp7c level=0]
When: After each comprehension trial

[P00406 | 4036:4129 | NORMAL_TEXT | LIST id=kix.91uvg5uydp7c level=0]
Question: “The description gave me enough information about where things were in the image.”

[P00407 | 4129:4161 | NORMAL_TEXT | LIST id=kix.91uvg5uydp7c level=0]
Scale: 1–5 optimal rating scale

[P00408 | 4161:4225 | NORMAL_TEXT | LIST id=kix.91uvg5uydp7c level=0]
Why useful: Captures general user judgment beyond task accuracy

[P00409 | 4225:4286 | NORMAL_TEXT | LIST id=kix.91uvg5uydp7c level=0]
Reference logic: Commonly used in BLV description evaluation

[P00410 | 4286:4287 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00411 | 4287:4309 | NORMAL_TEXT]
Scale same as above. 

[P00412 | 4309:4392 | NORMAL_TEXT]
“The description gave me enough information about where things were in the image.”

[P00413 | 4392:4415 | HEADING_2]
7. Raw NASA-TLX Subset

[P00414 | 4415:4434 | NORMAL_TEXT | LIST id=kix.np6netqin0bx level=0]
Field: Description

[P00415 | 4434:4502 | NORMAL_TEXT | LIST id=kix.np6netqin0bx level=0]
When: After each complexity block or after all comprehension trials

[P00416 | 4502:4544 | NORMAL_TEXT | LIST id=kix.np6netqin0bx level=0]
Items: Mental demand, effort, frustration

[P00417 | 4544:4555 | NORMAL_TEXT | LIST id=kix.np6netqin0bx level=0]
Scale: 1–7

[P00418 | 4555:4642 | NORMAL_TEXT | LIST id=kix.np6netqin0bx level=0]
Why useful: Checks whether one ordering method is easier or more cognitively demanding

[P00419 | 4642:4710 | NORMAL_TEXT | LIST id=kix.np6netqin0bx level=0]
Reference logic: NASA-TLX is a standard subjective workload measure

[P00420 | 4710:4735 | NORMAL_TEXT]
Suggested short version:

[P00421 | 4735:4803 | NORMAL_TEXT | LIST id=kix.of0qq8ae8z07 level=0]
How mentally demanding was it to understand this image description?

[P00422 | 4803:4870 | NORMAL_TEXT | LIST id=kix.of0qq8ae8z07 level=0]
How much effort did you need to understand this image description?

[P00423 | 4870:4943 | NORMAL_TEXT | LIST id=kix.of0qq8ae8z07 level=0]
How frustrated did you feel trying to understand this image description?

[P00424 | 4943:4965 | HEADING_2]
8. Preference Ranking

[P00425 | 4965:4984 | NORMAL_TEXT | LIST id=kix.rhkaa3w914xt level=0]
Field: Description

[P00426 | 4984:5006 | NORMAL_TEXT | LIST id=kix.rhkaa3w914xt level=0]
When: Preference task

[P00427 | 5006:5059 | NORMAL_TEXT | LIST id=kix.rhkaa3w914xt level=0]
Task: Rank the three descriptions from best to worst

[P00428 | 5059:5131 | NORMAL_TEXT | LIST id=kix.rhkaa3w914xt level=0]
Follow-up question: Ask user to explain why they chose their rank order

[P00429 | 5131:5225 | NORMAL_TEXT | LIST id=kix.rhkaa3w914xt level=0]
Why useful: Directly answers which ordering BLV users prefer when image content is controlled

[P00430 | 5225:5292 | NORMAL_TEXT | LIST id=kix.rhkaa3w914xt level=0]
Reference logic: Within-image comparison isolates ordering effects

[P00431 | 5292:5328 | NORMAL_TEXT]
For each preference image, collect:

[P00432 | 5328:5344 | NORMAL_TEXT | LIST id=kix.93p30r2ei4wf level=0]
Output: Example

[P00433 | 5344:5370 | NORMAL_TEXT | LIST id=kix.93p30r2ei4wf level=0]
Best description: Spatial

[P00434 | 5370:5409 | NORMAL_TEXT | LIST id=kix.93p30r2ei4wf level=0]
Ranking: Spatial > Semantic > Baseline

[P00435 | 5409:5478 | NORMAL_TEXT | LIST id=kix.93p30r2ei4wf level=0]
Explanation: “The first one helped me understand where things were.”

[P00436 | 5478:5503 | HEADING_2]
9. Qualitative Interview

[P00437 | 5503:5522 | NORMAL_TEXT | LIST id=kix.9mcohbvi6d2e level=0]
Field: Description

[P00438 | 5522:5543 | NORMAL_TEXT | LIST id=kix.9mcohbvi6d2e level=0]
When: End of session

[P00439 | 5543:5584 | NORMAL_TEXT | LIST id=kix.9mcohbvi6d2e level=0]
Question type: Semi-structured interview

[P00440 | 5584:5655 | NORMAL_TEXT | LIST id=kix.9mcohbvi6d2e level=0]
Why useful: Explains quantitative results and informs paper discussion

[P00441 | 5655:5758 | NORMAL_TEXT | LIST id=kix.9mcohbvi6d2e level=0]
Reference logic: Mixed-methods design is common in accessibility HCI because user needs are contextual

[P00442 | 5758:5779 | NORMAL_TEXT]
Suggested questions:

[P00443 | 5779:5916 | NORMAL_TEXT | LIST id=kix.pcau5fvivqk7 level=0]
Take a moment to reflect about when a description helped you build a clear mental map of a scene right away. What made it work so well? 

[P00444 | 5916:5995 | NORMAL_TEXT | LIST id=kix.pcau5fvivqk7 level=0]
Did listening to these descriptions ever feel mentally tiring or overwhelming?

[P00445 | 5995:6024 | NORMAL_TEXT | LIST id=kix.pcau5fvivqk7 level=1]
If yes, what was happening? 

[P00446 | 6024:6081 | NORMAL_TEXT | LIST id=kix.pcau5fvivqk7 level=1]
If not, what helped make the information easy to digest?

[P00447 | 6081:6222 | NORMAL_TEXT | LIST id=kix.pcau5fvivqk7 level=0]
If you were designing descriptions for artworks, what is the most important rule you’d recommend for how spatial layouts would be described?

[P00448 | 6222:6224 | NORMAL_TEXT]
[HORIZONTAL_RULE]

[P00449 | 6224:6260 | HEADING_2]
Spatial Relation Accuracy (dynamic)

[P00450 | 6260:6324 | NORMAL_TEXT]
Note: Frame of reference is always in the viewer’s perspective!

[P00451 | 6324:6325 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00452 | 6325:6384 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_26352a3f-c669-4371-ac6e-8d6899f17836

[P00453 | 6384:6385 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00454 | 6388:6407 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00455 | 6408:6417 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00456 | 6418:6434 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00457 | 6436:6469 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00458 | 6470:6534 | NORMAL_TEXT | TABLE row=1 col=1]
Was the seated man positioned to the right of the younger boy? 

[P00459 | 6534:6535 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00460 | 6535:6606 | NORMAL_TEXT | TABLE row=1 col=1]
Was the seated man positioned in front of the woman holding the baby? 

[P00461 | 6607:6611 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00462 | 6611:6612 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00463 | 6612:6615 | NORMAL_TEXT | TABLE row=1 col=2]
No

[P00464 | 6615:6616 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00465 | 6618:6653 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00466 | 6654:6729 | NORMAL_TEXT | TABLE row=2 col=1]
Were the women in white dresses positioned on the left side of the image? 

[P00467 | 6729:6730 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00468 | 6730:6792 | NORMAL_TEXT | TABLE row=2 col=1]
Was the younger boy positioned on the left side of the image?

[P00469 | 6793:6796 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00470 | 6796:6797 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00471 | 6797:6798 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00472 | 6798:6802 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00473 | 6803:6804 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00474 | 6804:6863 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_03da43fa-743f-49d5-92ad-d521accc5759

[P00475 | 6863:6864 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00476 | 6867:6886 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00477 | 6887:6896 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00478 | 6897:6913 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00479 | 6915:6948 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00480 | 6949:7014 | NORMAL_TEXT | TABLE row=1 col=1]
Was the nude woman positioned to the right of the standing man? 

[P00481 | 7014:7015 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00482 | 7015:7075 | NORMAL_TEXT | TABLE row=1 col=1]
Was the standing man positioned to the left of the hammock?

[P00483 | 7076:7080 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00484 | 7080:7081 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00485 | 7081:7082 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00486 | 7082:7086 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00487 | 7088:7123 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00488 | 7124:7198 | NORMAL_TEXT | TABLE row=2 col=1]
Were the nude woman and standing man positioned on the left of the image?

[P00489 | 7198:7199 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00490 | 7199:7256 | NORMAL_TEXT | TABLE row=2 col=1]
Was the hammock positioned near the center of the image?

[P00491 | 7257:7260 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00492 | 7260:7261 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00493 | 7261:7262 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00494 | 7262:7266 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00495 | 7267:7268 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00496 | 7268:7331 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_25c98bc8-af28-4194-a056-daeae1f0a001.png

[P00497 | 7331:7332 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00498 | 7335:7354 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00499 | 7355:7364 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00500 | 7365:7381 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00501 | 7383:7416 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00502 | 7417:7475 | NORMAL_TEXT | TABLE row=1 col=1]
Was the woman positioned to the right of the bearded man?

[P00503 | 7475:7476 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00504 | 7476:7545 | NORMAL_TEXT | TABLE row=1 col=1]
Was the young clean-shaven man positioned to the right of the woman?

[P00505 | 7546:7550 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00506 | 7550:7551 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00507 | 7551:7552 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00508 | 7552:7555 | NORMAL_TEXT | TABLE row=1 col=2]
No

[P00509 | 7557:7592 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00510 | 7593:7650 | NORMAL_TEXT | TABLE row=2 col=1]
Was the woman positioned on the right side of the image?

[P00511 | 7650:7651 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00512 | 7651:7708 | NORMAL_TEXT | TABLE row=2 col=1]
Was the table positioned on the lower half of the image?

[P00513 | 7709:7713 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00514 | 7713:7714 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00515 | 7714:7718 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00516 | 7719:7720 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00517 | 7720:7783 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_7ef08b06-e4ff-49e5-8c13-f79dd0b1a872.png

[P00518 | 7783:7784 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00519 | 7787:7806 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00520 | 7807:7816 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00521 | 7817:7833 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00522 | 7835:7868 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00523 | 7869:7925 | NORMAL_TEXT | TABLE row=1 col=1]
Was the woman positioned in front of the arched bridge?

[P00524 | 7925:7926 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00525 | 7926:7976 | NORMAL_TEXT | TABLE row=1 col=1]
Was the baby positioned to the left of the woman?

[P00526 | 7977:7981 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00527 | 7981:7982 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00528 | 7982:7986 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00529 | 7988:8023 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00530 | 8024:8090 | NORMAL_TEXT | TABLE row=2 col=1]
Was the baby boy positioned in the lower right side of the image?

[P00531 | 8090:8091 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00532 | 8091:8189 | NORMAL_TEXT | TABLE row=2 col=1]
Did the central group of people take up the most space in the center and right side of the image?

[P00533 | 8190:8193 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00534 | 8193:8194 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00535 | 8194:8195 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00536 | 8195:8199 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00537 | 8200:8201 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00538 | 8201:8264 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_c50ee8c2-db92-4e58-a6b8-0243dfe829d8.png

[P00539 | 8264:8265 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00540 | 8268:8287 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00541 | 8288:8297 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00542 | 8298:8314 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00543 | 8316:8349 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00544 | 8350:8400 | NORMAL_TEXT | TABLE row=1 col=1]
Was the skull positioned to the right of the man?

[P00545 | 8400:8401 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00546 | 8401:8456 | NORMAL_TEXT | TABLE row=1 col=1]
Was the hourglass positioned to the left of the skull?

[P00547 | 8457:8461 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00548 | 8461:8462 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00549 | 8462:8465 | NORMAL_TEXT | TABLE row=1 col=2]
No

[P00550 | 8467:8502 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00551 | 8503:8554 | NORMAL_TEXT | TABLE row=2 col=1]
Was the man positioned in the center of the image?

[P00552 | 8554:8555 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00553 | 8555:8618 | NORMAL_TEXT | TABLE row=2 col=1]
Was the gnarled tree positioned on the left side of the image?

[P00554 | 8619:8623 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00555 | 8623:8624 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00556 | 8624:8627 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00557 | 8628:8629 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00558 | 8629:8692 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_c77f8b64-98a2-4b3c-b270-1863ece147c5.png

[P00559 | 8692:8693 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00560 | 8696:8715 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00561 | 8716:8725 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00562 | 8726:8742 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00563 | 8744:8777 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00564 | 8778:8827 | NORMAL_TEXT | TABLE row=1 col=1]
Was the woman positioned above the stone coffin?

[P00565 | 8827:8828 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00566 | 8828:8897 | NORMAL_TEXT | TABLE row=1 col=1]
Was the white cloth positioned on the left side of the stone coffin?

[P00567 | 8898:8902 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00568 | 8902:8903 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00569 | 8903:8907 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00570 | 8909:8944 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00571 | 8945:9012 | NORMAL_TEXT | TABLE row=2 col=1]
Was the stone coffin positioned in the upper portion of the image?

[P00572 | 9012:9013 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00573 | 9013:9096 | NORMAL_TEXT | TABLE row=2 col=1]
Were the nude, babyish putti most densely concentrated in the center of the image?

[P00574 | 9097:9100 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00575 | 9100:9101 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00576 | 9101:9102 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00577 | 9102:9106 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00578 | 9107:9108 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00579 | 9108:9171 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_d24bdec0-5069-4768-96bd-583ca9629c0f.png

[P00580 | 9171:9172 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00581 | 9175:9194 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00582 | 9195:9204 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00583 | 9205:9221 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00584 | 9223:9256 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00585 | 9257:9330 | NORMAL_TEXT | TABLE row=1 col=1]
Were the dark green trees positioned to the left of the ruined building?

[P00586 | 9330:9331 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00587 | 9331:9402 | NORMAL_TEXT | TABLE row=1 col=1]
Was the pile of stone rubble positioned in front of the standing wall?

[P00588 | 9403:9407 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00589 | 9407:9408 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00590 | 9408:9409 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00591 | 9409:9413 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00592 | 9415:9450 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00593 | 9451:9516 | NORMAL_TEXT | TABLE row=2 col=1]
Was the standing wall positioned in the foreground of the image?

[P00594 | 9516:9517 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00595 | 9517:9584 | NORMAL_TEXT | TABLE row=2 col=1]
Was the ruined building positioned in the foreground of the image?

[P00596 | 9585:9589 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00597 | 9589:9590 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00598 | 9590:9593 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00599 | 9594:9595 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00600 | 9595:9658 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_08ce53a5-b87a-42e8-b7c2-c3dd21d05845.png

[P00601 | 9658:9659 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00602 | 9662:9681 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00603 | 9682:9691 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00604 | 9692:9708 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00605 | 9710:9743 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00606 | 9744:9805 | NORMAL_TEXT | TABLE row=1 col=1]
Was the standing child positioned to the right of the woman?

[P00607 | 9805:9806 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00608 | 9806:9875 | NORMAL_TEXT | TABLE row=1 col=1]
Was the sitting child positioned to the right of the standing child?

[P00609 | 9876:9879 | NORMAL_TEXT | TABLE row=1 col=2]
No

[P00610 | 9879:9880 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00611 | 9880:9881 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00612 | 9881:9885 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00613 | 9887:9922 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00614 | 9923:9977 | NORMAL_TEXT | TABLE row=2 col=1]
Was the woman positioned near the right of the image?

[P00615 | 9977:9978 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00616 | 9978:10047 | NORMAL_TEXT | TABLE row=2 col=1]
Were the clouds and blue sky in the upper right corner of the image?

[P00617 | 10048:10051 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00618 | 10051:10052 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00619 | 10052:10053 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00620 | 10053:10057 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00621 | 10058:10059 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00622 | 10059:10122 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_d25ae4f0-6e09-4ae3-9229-5d45ca3dec56.png

[P00623 | 10122:10123 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00624 | 10123:10124 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00625 | 10127:10146 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00626 | 10147:10156 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00627 | 10157:10173 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00628 | 10175:10208 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00629 | 10209:10264 | NORMAL_TEXT | TABLE row=1 col=1]
Was the grassy hill positioned in front of the people?

[P00630 | 10264:10265 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00631 | 10265:10329 | NORMAL_TEXT | TABLE row=1 col=1]
Was the stone wall positioned at the bottom of the grassy hill?

[P00632 | 10330:10334 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00633 | 10334:10335 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00634 | 10335:10339 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00635 | 10341:10376 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00636 | 10377:10440 | NORMAL_TEXT | TABLE row=2 col=1]
Was the grassy hill positioned on the right side of the image?

[P00637 | 10440:10441 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00638 | 10441:10510 | NORMAL_TEXT | TABLE row=2 col=1]
Were the two people positioned on the bottom left side of the image?

[P00639 | 10511:10514 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00640 | 10514:10515 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00641 | 10515:10519 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00642 | 10520:10521 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00643 | 10521:10584 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_17b4aa42-79e9-4356-8231-9299f1c3a279.png

[P00644 | 10584:10585 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00645 | 10588:10607 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00646 | 10608:10617 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00647 | 10618:10634 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00648 | 10636:10669 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00649 | 10670:10725 | NORMAL_TEXT | TABLE row=1 col=1]
Was the young man positioned to the left of the angel?

[P00650 | 10725:10726 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00651 | 10726:10778 | NORMAL_TEXT | TABLE row=1 col=1]
Was the young man holding a fish in his right hand?

[P00652 | 10779:10782 | NORMAL_TEXT | TABLE row=1 col=2]
No

[P00653 | 10782:10783 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00654 | 10783:10786 | NORMAL_TEXT | TABLE row=1 col=2]
No

[P00655 | 10788:10823 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00656 | 10824:10896 | NORMAL_TEXT | TABLE row=2 col=1]
Was the small white dog positioned in the lower-left area of the image?

[P00657 | 10896:10897 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00658 | 10897:10956 | NORMAL_TEXT | TABLE row=2 col=1]
Was the gold vessel positioned in the center of the image?

[P00659 | 10957:10961 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00660 | 10961:10962 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00661 | 10962:10963 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00662 | 10963:10966 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00663 | 10967:10968 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00664 | 10968:11031 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_c9c0f26e-a559-43ab-b517-0384e347ade8.png

[P00665 | 11031:11032 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00666 | 11035:11054 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00667 | 11055:11064 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00668 | 11065:11081 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00669 | 11083:11116 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00670 | 11117:11181 | NORMAL_TEXT | TABLE row=1 col=1]
Was the older woman positioned to the right of the bearded man?

[P00671 | 11181:11182 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00672 | 11182:11247 | NORMAL_TEXT | TABLE row=1 col=1]
Was the young girl positioned in front of the older bearded man?

[P00673 | 11248:11252 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00674 | 11252:11253 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00675 | 11253:11254 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00676 | 11254:11258 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00677 | 11260:11295 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00678 | 11296:11363 | NORMAL_TEXT | TABLE row=2 col=1]
Was the older bearded man positioned near the center of the image?

[P00679 | 11363:11364 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00680 | 11364:11438 | NORMAL_TEXT | TABLE row=2 col=1]
Were the two cloaked, older men positioned on the left side of the image?

[P00681 | 11439:11443 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00682 | 11443:11444 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00683 | 11444:11445 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00684 | 11445:11448 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00685 | 11449:11450 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00686 | 11450:11513 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_8175e345-711c-463c-9192-9814abaac5b6.png

[P00687 | 11513:11514 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00688 | 11517:11536 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00689 | 11537:11546 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00690 | 11547:11563 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00691 | 11565:11598 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00692 | 11599:11661 | NORMAL_TEXT | TABLE row=1 col=1]
Were the two boulders positioned in front of the green water?

[P00693 | 11661:11662 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00694 | 11662:11723 | NORMAL_TEXT | TABLE row=1 col=1]
Were the crashing waves positioned closer than the sailboat?

[P00695 | 11724:11728 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00696 | 11728:11729 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00697 | 11729:11733 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00698 | 11735:11770 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00699 | 11771:11828 | NORMAL_TEXT | TABLE row=2 col=1]
Was the small mound positioned on the left of the image?

[P00700 | 11828:11829 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00701 | 11829:11887 | NORMAL_TEXT | TABLE row=2 col=1]
Was the sailboat positioned near the center of the image?

[P00702 | 11888:11891 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00703 | 11891:11892 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00704 | 11892:11896 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00705 | 11897:11898 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00706 | 11898:11961 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_c1059816-1dc7-4af1-a5b3-26772de84b08.png

[P00707 | 11961:11962 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00708 | 11965:11984 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00709 | 11985:11994 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00710 | 11995:12011 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00711 | 12013:12046 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00712 | 12047:12120 | NORMAL_TEXT | TABLE row=1 col=1]
Was Abraham Lincoln positioned to the right of the woman in the chariot?

[P00713 | 12120:12121 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00714 | 12121:12186 | NORMAL_TEXT | TABLE row=1 col=1]
Were the horses positioned on the right side of Abraham Lincoln?

[P00715 | 12187:12191 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00716 | 12191:12192 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00717 | 12192:12193 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00718 | 12193:12196 | NORMAL_TEXT | TABLE row=1 col=2]
No

[P00719 | 12198:12233 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00720 | 12234:12312 | NORMAL_TEXT | TABLE row=2 col=1]
Was the woman in the chariot positioned in the center-left part of the image?

[P00721 | 12312:12313 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00722 | 12313:12386 | NORMAL_TEXT | TABLE row=2 col=1]
Was the U.S. Capitol building positioned in the foreground of the image?

[P00723 | 12387:12390 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00724 | 12390:12391 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00725 | 12391:12392 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00726 | 12392:12395 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00727 | 12396:12397 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00728 | 12397:12460 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_823405e0-599f-4fd8-ae71-4d901edc36b0.png

[P00729 | 12460:12461 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00730 | 12464:12483 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00731 | 12484:12493 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00732 | 12494:12510 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00733 | 12512:12545 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00734 | 12546:12592 | NORMAL_TEXT | TABLE row=1 col=1]
Was the building positioned above the bridge?

[P00735 | 12592:12593 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00736 | 12593:12647 | NORMAL_TEXT | TABLE row=1 col=1]
Were the sailboats positioned in front of the bridge?

[P00737 | 12648:12651 | NORMAL_TEXT | TABLE row=1 col=2]
No

[P00738 | 12651:12652 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00739 | 12652:12656 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00740 | 12658:12693 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00741 | 12694:12757 | NORMAL_TEXT | TABLE row=2 col=1]
Was the building positioned in the lower portion of the image?

[P00742 | 12757:12758 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00743 | 12758:12827 | NORMAL_TEXT | TABLE row=2 col=1]
Was the green grass positioned on the lower right side of the image?

[P00744 | 12828:12832 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00745 | 12832:12833 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00746 | 12833:12836 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00747 | 12837:12838 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00748 | 12838:12901 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_d37bc3dc-c3e0-4019-9725-f33404d7d5bc.png

[P00749 | 12901:12902 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00750 | 12905:12924 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00751 | 12925:12934 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00752 | 12935:12951 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00753 | 12953:12986 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00754 | 12987:13054 | NORMAL_TEXT | TABLE row=1 col=1]
Was the ornate building positioned on the right side of the plaza?

[P00755 | 13054:13055 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00756 | 13055:13097 | NORMAL_TEXT | TABLE row=1 col=1]
Was the bridge to the right of the plaza?

[P00757 | 13098:13102 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00758 | 13102:13103 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00759 | 13103:13104 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00760 | 13104:13107 | NORMAL_TEXT | TABLE row=1 col=2]
No

[P00761 | 13109:13144 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00762 | 13145:13201 | NORMAL_TEXT | TABLE row=2 col=1]
Was the canal positioned on the left side of the image?

[P00763 | 13201:13202 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00764 | 13202:13258 | NORMAL_TEXT | TABLE row=2 col=1]
Was the plaza positioned on the left side of the image?

[P00765 | 13259:13263 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00766 | 13263:13264 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00767 | 13264:13267 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00768 | 13268:13269 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00769 | 13269:13332 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_bf9843af-1922-483f-8b6b-ccfa852de356.png

[P00770 | 13332:13333 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00771 | 13336:13355 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00772 | 13356:13365 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00773 | 13366:13382 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00774 | 13384:13417 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00775 | 13418:13511 | NORMAL_TEXT | TABLE row=1 col=1]
Was the man in the dark coat positioned to the left of the woman in the green-colored dress?

[P00776 | 13511:13512 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00777 | 13512:13597 | NORMAL_TEXT | TABLE row=1 col=1]
Was the woman in the white dress positioned to the left of the man in the dark coat?

[P00778 | 13598:13602 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00779 | 13602:13603 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00780 | 13603:13604 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00781 | 13604:13607 | NORMAL_TEXT | TABLE row=1 col=2]
No

[P00782 | 13609:13644 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00783 | 13645:13714 | NORMAL_TEXT | TABLE row=2 col=1]
Was the brown dog positioned in the lower-right corner of the image?

[P00784 | 13714:13715 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00785 | 13715:13788 | NORMAL_TEXT | TABLE row=2 col=1]
Was the high wall stretched across the upper right portion of the image?

[P00786 | 13789:13793 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00787 | 13793:13794 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00788 | 13794:13795 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00789 | 13795:13796 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00790 | 13796:13800 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00791 | 13801:13802 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00792 | 13802:13865 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_bf6c7c73-82e8-4ef7-8ac8-71920c8eb2b9.png

[P00793 | 13865:13866 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00794 | 13869:13888 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00795 | 13889:13898 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00796 | 13899:13915 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00797 | 13917:13950 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00798 | 13951:14007 | NORMAL_TEXT | TABLE row=1 col=1]
Was the town positioned to the left of the young woman?

[P00799 | 14007:14008 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00800 | 14008:14057 | NORMAL_TEXT | TABLE row=1 col=1]
Was the umbrella held by the woman’s right hand?

[P00801 | 14058:14062 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00802 | 14062:14063 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00803 | 14063:14066 | NORMAL_TEXT | TABLE row=1 col=2]
No

[P00804 | 14068:14103 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00805 | 14104:14167 | NORMAL_TEXT | TABLE row=2 col=1]
Was the young woman positioned on the right side of the image?

[P00806 | 14167:14168 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00807 | 14168:14230 | NORMAL_TEXT | TABLE row=2 col=1]
Were the sailboats positioned in the foreground of the image?

[P00808 | 14231:14235 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00809 | 14235:14236 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00810 | 14236:14237 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00811 | 14237:14240 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00812 | 14241:14242 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00813 | 14242:14305 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_cd382af4-5334-485a-8121-c52ce7abf13a.png

[P00814 | 14305:14306 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00815 | 14309:14328 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00816 | 14329:14338 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00817 | 14339:14355 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00818 | 14357:14390 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00819 | 14391:14458 | NORMAL_TEXT | TABLE row=1 col=1]
Was the figure in dark robes positioned to the right of the cross?

[P00820 | 14458:14459 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00821 | 14459:14527 | NORMAL_TEXT | TABLE row=1 col=1]
Was the crucified figure positioned above the two figures in robes?

[P00822 | 14528:14531 | NORMAL_TEXT | TABLE row=1 col=2]
No

[P00823 | 14531:14532 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00824 | 14532:14536 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00825 | 14538:14573 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00826 | 14574:14634 | NORMAL_TEXT | TABLE row=2 col=1]
Was the skull positioned in the lower portion of the image?

[P00827 | 14634:14635 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00828 | 14635:14708 | NORMAL_TEXT | TABLE row=2 col=1]
Was the inscription "INRI" positioned at the bottom center of the image?

[P00829 | 14709:14713 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00830 | 14713:14714 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00831 | 14714:14715 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00832 | 14715:14718 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00833 | 14719:14720 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00834 | 14720:14783 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_00209fb1-64a2-4961-9ccc-8c6c06117df2.png

[P00835 | 14783:14784 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00836 | 14784:14785 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00837 | 14788:14807 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00838 | 14808:14817 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00839 | 14818:14834 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00840 | 14836:14869 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00841 | 14870:14934 | NORMAL_TEXT | TABLE row=1 col=1]
Was the yellowed pine tree positioned to the left of the house?

[P00842 | 14934:14935 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00843 | 14935:14979 | NORMAL_TEXT | TABLE row=1 col=1]
Was the garden positioned behind the house?

[P00844 | 14980:14984 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00845 | 14984:14985 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00846 | 14985:14988 | NORMAL_TEXT | TABLE row=1 col=2]
No

[P00847 | 14990:15025 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00848 | 15026:15083 | NORMAL_TEXT | TABLE row=2 col=1]
Was the house positioned in the background of the image?

[P00849 | 15083:15084 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00850 | 15084:15145 | NORMAL_TEXT | TABLE row=2 col=1]
Was the pine tree positioned in the foreground of the image?

[P00851 | 15146:15150 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00852 | 15150:15151 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00853 | 15151:15155 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00854 | 15156:15157 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00855 | 15157:15220 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_bb029ac1-a5eb-4d1e-99b8-887a63dc14c0.png

[P00856 | 15220:15221 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00857 | 15224:15243 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00858 | 15244:15253 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00859 | 15254:15270 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00860 | 15272:15305 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00861 | 15306:15375 | NORMAL_TEXT | TABLE row=1 col=1]
Was the building positioned to the left side of the narrow alleyway?

[P00862 | 15375:15376 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00863 | 15376:15439 | NORMAL_TEXT | TABLE row=1 col=1]
Were the carriages positioned in front of the narrow alleyway?

[P00864 | 15440:15444 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00865 | 15444:15445 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00866 | 15445:15446 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00867 | 15446:15450 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00868 | 15452:15487 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00869 | 15488:15557 | NORMAL_TEXT | TABLE row=2 col=1]
Were the three carriages positioned on the bottom left of the image?

[P00870 | 15557:15558 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00871 | 15558:15625 | NORMAL_TEXT | TABLE row=2 col=1]
Was the narrow alleyway positioned on the right side of the image?

[P00872 | 15626:15629 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00873 | 15629:15630 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00874 | 15630:15631 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00875 | 15631:15635 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00876 | 15636:15637 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00877 | 15637:15700 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_7583412c-fee6-496a-b316-467f8a495a40.png

[P00878 | 15700:15702 | NORMAL_TEXT]
[INLINE_OBJECT kix.7qb5aljq0chn]

[P00879 | 15702:15703 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00880 | 15706:15725 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00881 | 15726:15735 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00882 | 15736:15752 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00883 | 15754:15787 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00884 | 15788:15855 | NORMAL_TEXT | TABLE row=1 col=1]
Was the standing child positioned to the left of the seated child?

[P00885 | 15855:15856 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00886 | 15856:15926 | NORMAL_TEXT | TABLE row=1 col=1]
Was the carved adult head positioned to the left of the seated child?

[P00887 | 15927:15931 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00888 | 15931:15932 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00889 | 15932:15935 | NORMAL_TEXT | TABLE row=1 col=2]
No

[P00890 | 15937:15972 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00891 | 15973:16034 | NORMAL_TEXT | TABLE row=2 col=1]
Was the stone plinth positioned to the left of the children?

[P00892 | 16034:16035 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00893 | 16035:16099 | NORMAL_TEXT | TABLE row=2 col=1]
Was the stone plinth positioned in the upper half of the image?

[P00894 | 16100:16104 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00895 | 16104:16105 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00896 | 16105:16106 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00897 | 16106:16109 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00898 | 16110:16111 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00899 | 16111:16174 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_cee66f21-05f2-4009-80e6-3e6b282966a9.png

[P00900 | 16177:16196 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00901 | 16197:16206 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00902 | 16207:16223 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00903 | 16225:16258 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00904 | 16259:16322 | NORMAL_TEXT | TABLE row=1 col=1]
Were the gray cliffs positioned on the left side of the image?

[P00905 | 16322:16323 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00906 | 16323:16380 | NORMAL_TEXT | TABLE row=1 col=1]
Was the yellow expanse positioned in front of the water?

[P00907 | 16381:16384 | NORMAL_TEXT | TABLE row=1 col=2]
No

[P00908 | 16384:16385 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00909 | 16385:16389 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00910 | 16391:16426 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00911 | 16427:16487 | NORMAL_TEXT | TABLE row=2 col=1]
Was the slender tree positioned in the center of the image?

[P00912 | 16487:16488 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00913 | 16488:16546 | NORMAL_TEXT | TABLE row=2 col=1]
Were the hills positioned in the background of the image?

[P00914 | 16547:16551 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00915 | 16551:16552 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00916 | 16552:16556 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00917 | 16557:16558 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00918 | 16558:16621 | NORMAL_TEXT | LIST id=kix.yni331tc5gsv level=0]
imageFilename: sample_b9c9e75c-e81b-4dab-aafe-12045660422f.png

[P00919 | 16621:16623 | NORMAL_TEXT]
[INLINE_OBJECT kix.ip1glq9uqxog]

[P00920 | 16626:16645 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P00921 | 16646:16655 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P00922 | 16656:16672 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P00923 | 16674:16707 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P00924 | 16708:16760 | NORMAL_TEXT | TABLE row=1 col=1]
Was the sunset positioned to the right of the tree?

[P00925 | 16760:16761 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P00926 | 16761:16828 | NORMAL_TEXT | TABLE row=1 col=1]
Was the canopy most densely concentrated to the left of the water?

[P00927 | 16829:16833 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00928 | 16833:16834 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P00929 | 16834:16838 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P00930 | 16840:16875 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P00931 | 16876:16940 | NORMAL_TEXT | TABLE row=2 col=1]
Was the closest tree positioned on the right side of the image?

[P00932 | 16940:16941 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P00933 | 16941:17004 | NORMAL_TEXT | TABLE row=2 col=1]
Was the water positioned on the lower-right side of the image?

[P00934 | 17005:17008 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P00935 | 17008:17009 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P00936 | 17009:17013 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P00937 | 17014:17015 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

## Analysis Plan (t.cjsdjgpmtjw)

[P00938 | 1:15 | HEADING_1]
Analysis Plan

[P00939 | 15:38 | HEADING_2]
Descriptive Statistics

[P00940 | 38:106 | NORMAL_TEXT]
Start with descriptive statistics because the sample size is small.

[P00941 | 106:114 | NORMAL_TEXT]
Report:

[P00942 | 117:125 | NORMAL_TEXT | TABLE row=0 col=0]
Measure

[P00943 | 126:136 | NORMAL_TEXT | TABLE row=0 col=1]
Statistic

[P00944 | 138:158 | NORMAL_TEXT | TABLE row=1 col=0]
Comprehension score

[P00945 | 159:192 | NORMAL_TEXT | TABLE row=1 col=1]
Mean, median, standard deviation

[P00946 | 194:211 | NORMAL_TEXT | TABLE row=2 col=0]
Spatial accuracy

[P00947 | 212:242 | NORMAL_TEXT | TABLE row=2 col=1]
Mean, median, percent correct

[P00948 | 244:258 | NORMAL_TEXT | TABLE row=3 col=0]
Semantic gist

[P00949 | 259:289 | NORMAL_TEXT | TABLE row=3 col=1]
Mean, median, percent correct

[P00950 | 291:312 | NORMAL_TEXT | TABLE row=4 col=0]
Mental image clarity

[P00951 | 313:329 | NORMAL_TEXT | TABLE row=4 col=1]
Mean and median

[P00952 | 331:347 | NORMAL_TEXT | TABLE row=5 col=0]
Spatial clarity

[P00953 | 348:364 | NORMAL_TEXT | TABLE row=5 col=1]
Mean and median

[P00954 | 366:384 | NORMAL_TEXT | TABLE row=6 col=0]
Perceived quality

[P00955 | 385:401 | NORMAL_TEXT | TABLE row=6 col=1]
Mean and median

[P00956 | 403:418 | NORMAL_TEXT | TABLE row=7 col=0]
Cognitive load

[P00957 | 419:435 | NORMAL_TEXT | TABLE row=7 col=1]
Mean and median

[P00958 | 437:456 | NORMAL_TEXT | TABLE row=8 col=0]
Preference ranking

[P00959 | 457:478 | NORMAL_TEXT | TABLE row=8 col=1]
Count and percentage

[P00960 | 479:481 | NORMAL_TEXT]
[HORIZONTAL_RULE]

[P00961 | 481:503 | HEADING_2]
Condition Comparisons

[P00962 | 503:600 | NORMAL_TEXT]
Use nonparametric or mixed-effects analysis depending on the final sample size and distribution.

[P00963 | 603:613 | NORMAL_TEXT | TABLE row=0 col=0]
Situation

[P00964 | 614:631 | NORMAL_TEXT | TABLE row=0 col=1]
Suggested method

[P00965 | 633:666 | NORMAL_TEXT | TABLE row=1 col=0]
Small sample and ordinal ratings

[P00966 | 667:681 | NORMAL_TEXT | TABLE row=1 col=1]
Friedman test

[P00967 | 683:740 | NORMAL_TEXT | TABLE row=2 col=0]
Repeated measures with participant and image variability

[P00968 | 741:761 | NORMAL_TEXT | TABLE row=2 col=1]
Mixed-effects model

[P00969 | 763:782 | NORMAL_TEXT | TABLE row=3 col=0]
Pairwise follow-up

[P00970 | 783:825 | NORMAL_TEXT | TABLE row=3 col=1]
Wilcoxon signed-rank test with correction

[P00971 | 827:846 | NORMAL_TEXT | TABLE row=4 col=0]
Preference ranking

[P00972 | 847:889 | NORMAL_TEXT | TABLE row=4 col=1]
Rank aggregation and condition-wise count

[P00973 | 891:917 | NORMAL_TEXT | TABLE row=5 col=0]
Relationship with NDC/SAC

[P00974 | 918:950 | NORMAL_TEXT | TABLE row=5 col=1]
Spearman or Kendall correlation

[P00975 | 951:953 | NORMAL_TEXT]
[HORIZONTAL_RULE]

[P00976 | 953:982 | HEADING_2]
Correlation With NDC and SAC

[P00977 | 982:1044 | NORMAL_TEXT]
Analyze whether user outcomes correlate with Milad’s metrics.

[P00978 | 1044:1067 | NORMAL_TEXT]
Possible correlations:

[P00979 | 1070:1077 | NORMAL_TEXT | TABLE row=0 col=0]
Metric

[P00980 | 1078:1092 | NORMAL_TEXT | TABLE row=0 col=1]
User outcome 

[P00981 | 1094:1098 | NORMAL_TEXT | TABLE row=1 col=0]
NDC

[P00982 | 1099:1115 | NORMAL_TEXT | TABLE row=1 col=1]
Spatial clarity

[P00983 | 1117:1121 | NORMAL_TEXT | TABLE row=2 col=0]
NDC

[P00984 | 1122:1148 | NORMAL_TEXT | TABLE row=2 col=1]
Spatial relation accuracy

[P00985 | 1150:1154 | NORMAL_TEXT | TABLE row=3 col=0]
NDC

[P00986 | 1155:1176 | NORMAL_TEXT | TABLE row=3 col=1]
Mental image clarity

[P00987 | 1178:1182 | NORMAL_TEXT | TABLE row=4 col=0]
SAC

[P00988 | 1183:1206 | NORMAL_TEXT | TABLE row=4 col=1]
Semantic gist accuracy

[P00989 | 1208:1212 | NORMAL_TEXT | TABLE row=5 col=0]
SAC

[P00990 | 1213:1231 | NORMAL_TEXT | TABLE row=5 col=1]
Perceived quality

[P00991 | 1233:1245 | NORMAL_TEXT | TABLE row=6 col=0]
NDC and SAC

[P00992 | 1246:1265 | NORMAL_TEXT | TABLE row=6 col=1]
Preference ranking

[P00993 | 1266:1372 | NORMAL_TEXT]
Use Spearman or Kendall correlation because the data will likely be ordinal and the sample size is small.

[P00994 | 1372:1373 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

## Image Complexity Control (t.ptrsbtusz15v)

[P00995 | 1:26 | HEADING_1]
Image Complexity Control

[P00996 | 26:31 | HEADING_2]
Goal

[P00997 | 31:120 | NORMAL_TEXT]
The study needs candidate image sets where the three ordering conditions are comparable.

[P00998 | 120:239 | NORMAL_TEXT]
The image complexity level should be controlled so that one condition is not tested mostly on easier or harder images.

[P00999 | 239:241 | NORMAL_TEXT]
[HORIZONTAL_RULE]

[P01000 | 241:280 | HEADING_2]
Proposed Quantitative Complexity Score

[P01001 | 280:411 | NORMAL_TEXT]
Each image row can receive a weighted complexity score based on scene-structure features rather than generated-description length.

[P01002 | 414:422 | NORMAL_TEXT | TABLE row=0 col=0]
Feature

[P01003 | 423:430 | NORMAL_TEXT | TABLE row=0 col=1]
Weight

[P01004 | 431:441 | NORMAL_TEXT | TABLE row=0 col=2]
Rationale

[P01005 | 443:468 | NORMAL_TEXT | TABLE row=1 col=0]
Number of scene elements

[P01006 | 469:474 | NORMAL_TEXT | TABLE row=1 col=1]
0.35

[P01007 | 475:559 | NORMAL_TEXT | TABLE row=1 col=2]
More elements increase memory load and require users to integrate more information.

[P01008 | 561:597 | NORMAL_TEXT | TABLE row=2 col=0]
Spatial spread of selected elements

[P01009 | 598:603 | NORMAL_TEXT | TABLE row=2 col=1]
0.25

[P01010 | 604:676 | NORMAL_TEXT | TABLE row=2 col=2]
Elements distributed across the image require more spatial integration.

[P01011 | 678:700 | NORMAL_TEXT | TABLE row=3 col=0]
Traversal path length

[P01012 | 701:706 | NORMAL_TEXT | TABLE row=3 col=1]
0.20

[P01013 | 707:799 | NORMAL_TEXT | TABLE row=3 col=2]
Longer movement between described elements indicates a more complex spatial/narrative path.

[P01014 | 801:822 | NORMAL_TEXT | TABLE row=4 col=0]
Agent/action density

[P01015 | 823:828 | NORMAL_TEXT | TABLE row=4 col=1]
0.15

[P01016 | 829:887 | NORMAL_TEXT | TABLE row=4 col=2]
People, actions, and events increase semantic complexity.

[P01017 | 889:920 | NORMAL_TEXT | TABLE row=5 col=0]
Background/layering complexity

[P01018 | 921:926 | NORMAL_TEXT | TABLE row=5 col=1]
0.05

[P01019 | 927:1022 | NORMAL_TEXT | TABLE row=5 col=2]
Scenes with clear foreground, middle ground, and background require more spatial organization.

[P01020 | 1023:1032 | NORMAL_TEXT]
Formula:

[P01021 | 1032:1197 | NORMAL_TEXT]
Complexity score = 0.35 × element count + 0.25 × spatial spread + 0.20 × traversal path length + 0.15 × agent/action density + 0.05 × background/layering complexity

[P01022 | 1197:1243 | NORMAL_TEXT]
After computing the score, split images into:

[P01023 | 1246:1263 | NORMAL_TEXT | TABLE row=0 col=0]
Complexity group

[P01024 | 1264:1269 | NORMAL_TEXT | TABLE row=0 col=1]
Rule

[P01025 | 1271:1275 | NORMAL_TEXT | TABLE row=1 col=0]
Low

[P01026 | 1276:1310 | NORMAL_TEXT | TABLE row=1 col=1]
Bottom third of complexity scores

[P01027 | 1312:1319 | NORMAL_TEXT | TABLE row=2 col=0]
Medium

[P01028 | 1320:1333 | NORMAL_TEXT | TABLE row=2 col=1]
Middle third

[P01029 | 1335:1340 | NORMAL_TEXT | TABLE row=3 col=0]
High

[P01030 | 1341:1351 | NORMAL_TEXT | TABLE row=3 col=1]
Top third

[P01031 | 1352:1379 | HEADING_2]
Candidate Set Construction

[P01032 | 1379:1407 | NORMAL_TEXT]
For the comprehension task:

[P01033 | 1407:1421 | NORMAL_TEXT | LIST id=kix.j41klgi7uwl4 level=0]
Low: 3 images

[P01034 | 1421:1438 | NORMAL_TEXT | LIST id=kix.j41klgi7uwl4 level=0]
Medium: 3 images

[P01035 | 1438:1453 | NORMAL_TEXT | LIST id=kix.j41klgi7uwl4 level=0]
High: 3 images

[P01036 | 1453:1478 | NORMAL_TEXT]
For the preference task:

[P01037 | 1478:1491 | NORMAL_TEXT | LIST id=kix.e474t5q38px0 level=0]
Low: 1 image

[P01038 | 1491:1507 | NORMAL_TEXT | LIST id=kix.e474t5q38px0 level=0]
Medium: 1 image

[P01039 | 1507:1521 | NORMAL_TEXT | LIST id=kix.e474t5q38px0 level=0]
High: 1 image

[P01040 | 1521:1541 | NORMAL_TEXT]
Selection criteria:

[P01041 | 1541:1606 | NORMAL_TEXT | LIST id=kix.beiumkvlvu9z level=0]
Use images with the same number of scene elements when possible.

[P01042 | 1606:1679 | NORMAL_TEXT | LIST id=kix.beiumkvlvu9z level=0]
Prefer 5-element images because most dataset rows have 5 scene elements.

[P01043 | 1679:1750 | NORMAL_TEXT | LIST id=kix.beiumkvlvu9z level=0]
Avoid using the same image in both comprehension and preference tasks.

[P01044 | 1750:1813 | NORMAL_TEXT | LIST id=kix.beiumkvlvu9z level=0]
Balance complexity across conditions through counterbalancing.

[P01045 | 1813:1887 | NORMAL_TEXT | LIST id=kix.beiumkvlvu9z level=0]
Avoid images with unclear, broken, or low-quality generated descriptions.

[P01046 | 1887:1988 | NORMAL_TEXT | LIST id=kix.beiumkvlvu9z level=0]
After visual inspection, exclude images where the selected elements do not represent the image well.

[P01047 | 1988:1989 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

## References (t.utxobzu22k23)

[P01048 | 1:2 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P01049 | 5:11 | NORMAL_TEXT | TABLE row=0 col=0]
Topic

[P01050 | 12:19 | NORMAL_TEXT | TABLE row=0 col=1]
Source

[P01051 | 20:24 | NORMAL_TEXT | TABLE row=0 col=2]
URL

[P01052 | 25:43 | NORMAL_TEXT | TABLE row=0 col=3]
Use in study plan

[P01053 | 45:78 | NORMAL_TEXT | TABLE row=1 col=0]
BLV image-description evaluation

[P01054 | 79:158 | NORMAL_TEXT | TABLE row=1 col=1]
Context-Aware Image Descriptions for Web Accessibility, Mohanbabu & Pavel 2024

[P01055 | 159:192 | NORMAL_TEXT | TABLE row=1 col=2]
[https://arxiv.org/abs/2409.03054](https://arxiv.org/abs/2409.03054)

[P01056 | 193:299 | NORMAL_TEXT | TABLE row=1 col=3]
Supports BLV participant study design and ratings for quality, imaginability, relevance, and plausibility

[P01057 | 301:348 | NORMAL_TEXT | TABLE row=2 col=0]
Metric limitations and BLV-centered evaluation

[P01058 | 349:426 | NORMAL_TEXT | TABLE row=2 col=1]
Context Matters for Image Descriptions for Accessibility, Kreiss et al. 2022

[P01059 | 427:460 | NORMAL_TEXT | TABLE row=2 col=2]
[https://arxiv.org/abs/2205.10646](https://arxiv.org/abs/2205.10646)

[P01060 | 461:535 | NORMAL_TEXT | TABLE row=2 col=3]
Supports not relying only on automated metrics and collecting BLV ratings

[P01061 | 537:590 | NORMAL_TEXT | TABLE row=3 col=0]
Screen-reader structure, navigation, and description

[P01062 | 591:674 | NORMAL_TEXT | TABLE row=3 col=1]
Rich Screen Reader Experiences for Accessible Data Visualization, Zong et al. 2022

[P01063 | 675:708 | NORMAL_TEXT | TABLE row=3 col=2]
[https://arxiv.org/abs/2205.04917](https://arxiv.org/abs/2205.04917)

[P01064 | 709:800 | NORMAL_TEXT | TABLE row=3 col=3]
Supports structure and order as accessibility design dimensions for mental-model formation

[P01065 | 802:842 | NORMAL_TEXT | TABLE row=4 col=0]
Visual question answering for BLV users

[P01066 | 843:886 | NORMAL_TEXT | TABLE row=4 col=1]
VizWiz Grand Challenge, Gurari et al. 2018

[P01067 | 887:920 | NORMAL_TEXT | TABLE row=4 col=2]
[https://arxiv.org/abs/1802.08218](https://arxiv.org/abs/1802.08218)

[P01068 | 921:1006 | NORMAL_TEXT | TABLE row=4 col=3]
Supports question-answer style comprehension evaluation for BLV visual understanding

[P01069 | 1008:1043 | NORMAL_TEXT | TABLE row=5 col=0]
VQA as image understanding measure

[P01070 | 1044:1094 | NORMAL_TEXT | TABLE row=5 col=1]
VQA: Visual Question Answering, Antol et al. 2015

[P01071 | 1095:1128 | NORMAL_TEXT | TABLE row=5 col=2]
[https://arxiv.org/abs/1505.00468](https://arxiv.org/abs/1505.00468)

[P01072 | 1129:1207 | NORMAL_TEXT | TABLE row=5 col=3]
Supports targeted questions as a way to evaluate detailed image understanding

[P01073 | 1209:1218 | NORMAL_TEXT | TABLE row=6 col=0]
Workload

[P01074 | 1219:1237 | NORMAL_TEXT | TABLE row=6 col=1]
NASA-TLX overview

[P01075 | 1238:1277 | NORMAL_TEXT | TABLE row=6 col=2]
[https://en.wikipedia.org/wiki/NASA-TLX](https://en.wikipedia.org/wiki/NASA-TLX)

[P01076 | 1278:1355 | NORMAL_TEXT | TABLE row=6 col=3]
Supports workload ratings, especially mental demand, effort, and frustration

[P01077 | 1357:1389 | NORMAL_TEXT | TABLE row=7 col=0]
Within-subject counterbalancing

[P01078 | 1390:1424 | NORMAL_TEXT | TABLE row=7 col=1]
Repeated measures design overview

[P01079 | 1425:1480 | NORMAL_TEXT | TABLE row=7 col=2]
[https://en.wikipedia.org/wiki/Repeated_measures_design](https://en.wikipedia.org/wiki/Repeated_measures_design)

[P01080 | 1481:1560 | NORMAL_TEXT | TABLE row=7 col=3]
Supports repeated-measures design and counterbalancing to reduce order effects

[P01081 | 1562:1587 | NORMAL_TEXT | TABLE row=8 col=0]
Text order and coherence

[P01082 | 1588:1653 | NORMAL_TEXT | TABLE row=8 col=1]
Sentence Ordering and Coherence Modeling, Logeswaran et al. 2016

[P01083 | 1654:1687 | NORMAL_TEXT | TABLE row=8 col=2]
[https://arxiv.org/abs/1611.02654](https://arxiv.org/abs/1611.02654)

[P01084 | 1688:1754 | NORMAL_TEXT | TABLE row=8 col=3]
Supports treating ordering as a coherence-related design variable

[P01085 | 1756:1787 | NORMAL_TEXT | TABLE row=9 col=0]
Spatio-semantic narrative path

[P01086 | 1788:1872 | NORMAL_TEXT | TABLE row=9 col=1]
Advancing Automated Spatio-Semantic Analysis in Picture Description, Ng et al. 2025

[P01087 | 1873:1906 | NORMAL_TEXT | TABLE row=9 col=2]
[https://arxiv.org/abs/2510.05128](https://arxiv.org/abs/2510.05128)

[P01088 | 1907:1992 | NORMAL_TEXT | TABLE row=9 col=3]
Supports treating order/path of described visual elements as analytically meaningful

[P01089 | 1994:2011 | NORMAL_TEXT | TABLE row=10 col=0]
Alt text purpose

[P01090 | 2012:2050 | NORMAL_TEXT | TABLE row=10 col=1]
W3C/WCAG summarized alt text guidance

[P01091 | 2051:2095 | NORMAL_TEXT | TABLE row=10 col=2]
[https://en.wikipedia.org/wiki/Alt_attribute](https://en.wikipedia.org/wiki/Alt_attribute)

[P01092 | 2096:2212 | NORMAL_TEXT | TABLE row=10 col=3]
Supports alt text as a replacement for visual content, judged by meaning and intent rather than literal object list

[P01093 | 2213:2214 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P01094 | 2214:2215 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

## Pilot study feedback (t.jnbeyccwrwf9)

[P01095 | 1:102 | NORMAL_TEXT]
We did two pilots with Milad and Jamila, most importantly with Jamila, and here are the main points:

[P01096 | 102:103 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P01097 | 103:114 | NORMAL_TEXT]
Study Load

[P01098 | 114:389 | NORMAL_TEXT | LIST id=kix.mf72ilkftxy3 level=0]
The user study with 4 conditions (20 images) is not doable in terms of time. It took 45 min to go through 9 tasks with Milad, so we reduced it to two conditions (10 images for the comprehension tasks and 3 for the preference tasks), and it took a total of 1 hour to complete

[P01099 | 389:414 | NORMAL_TEXT | LIST id=kix.mf72ilkftxy3 level=0]
Other time optimization,

[P01100 | 414:416 | NORMAL_TEXT | LIST id=kix.mf72ilkftxy3 level=1]
 

[P01101 | 416:436 | NORMAL_TEXT]
Confounding factors

[P01102 | 436:681 | NORMAL_TEXT]
From the table below, we can see that for GPT-5, the spatial setting (2D and depth) yields many more spatial expressions than the no-order setting. While this might provide more information about where things are, it might also overwhelm users.

[P01103 | 681:837 | NORMAL_TEXT]
For the preference study, Jamila consistently chose the baseline description because it had fewer spatial descriptions, and she noted this in her feedback.

[P01104 | 837:967 | NORMAL_TEXT]
But we still might find that the user can still answer more questions correctly about the spatial relation between scene elements

[P01105 | 967:968 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P01106 | 968:1082 | NORMAL_TEXT]
→It might be a fairer comparison to select descriptions with the same number of spatial expressions for the study

[P01107 | 1082:1083 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P01108 | 1083:1085 | NORMAL_TEXT]
[INLINE_OBJECT kix.eo95clksnzw0]

[P01109 | 1085:1086 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P01110 | 1086:1358 | NORMAL_TEXT]
After investigating the model generation, I noticed that we were using the wrong prompt for the spatial controls. It contains an extra requirement that enforces the model to also anchor the objects into the frame, which was causing an extra number of spatial expressions.

[P01111 | 1358:1359 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P01112 | 1359:1360 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P01113 | 1360:1370 | NORMAL_TEXT]
Feedback:

[P01114 | 1370:1406 | NORMAL_TEXT | LIST id=kix.27b6yshj75th level=0]
The user study would be two stages:

[P01115 | 1406:1452 | NORMAL_TEXT | LIST id=kix.27b6yshj75th level=1]
Wide-audience evaluation with sighted people:

[P01116 | 1452:1501 | NORMAL_TEXT | LIST id=kix.27b6yshj75th level=2]
No user interviews but just open-ended questions

[P01117 | 1501:1541 | NORMAL_TEXT | LIST id=kix.27b6yshj75th level=2]
We recruit participants using prolific 

[P01118 | 1541:1663 | NORMAL_TEXT | LIST id=kix.27b6yshj75th level=2]
We can scale the number of participants and evaluation points up to 100 and compare all  4 conditions (with fewer images)

[P01119 | 1663:1682 | NORMAL_TEXT | LIST id=kix.27b6yshj75th level=1]
BLV use case study

[P01120 | 1682:1732 | NORMAL_TEXT | LIST id=kix.27b6yshj75th level=2]
Comparing top 2 conditions from the wide-audience

[P01121 | 1732:1768 | NORMAL_TEXT | LIST id=kix.27b6yshj75th level=2]
Similar to what we did in the pilot

[P01122 | 1768:1876 | NORMAL_TEXT | LIST id=kix.27b6yshj75th level=0]
We could mention that the pilot study more expressions wasn’t good so we fix it to specific number (3 or 5)

[P01123 | 1876:1939 | NORMAL_TEXT | LIST id=kix.27b6yshj75th level=0]
Regenerating and evaluating the alt-texts using the new prompt

[P01124 | 1939:1940 | NORMAL_TEXT | LIST id=kix.27b6yshj75th level=0]
⟦EMPTY PARAGRAPH⟧

## Tab 8 (t.n11g4to39luu)

[P01125 | 1:38 | NORMAL_TEXT | LIST id=kix.xk696y2vvqj7 level=0]
823405e0-599f-4fd8-ae71-4d901edc36b0

[P01126 | 38:39 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P01127 | 42:61 | NORMAL_TEXT | TABLE row=0 col=0]
Frame of reference

[P01128 | 62:71 | NORMAL_TEXT | TABLE row=0 col=1]
Question

[P01129 | 72:88 | NORMAL_TEXT | TABLE row=0 col=2]
Answer (Yes/No)

[P01130 | 90:123 | NORMAL_TEXT | TABLE row=1 col=0]
Intrinsic frame of reference (2)

[P01131 | 124:188 | NORMAL_TEXT | TABLE row=1 col=1]
Was the seated man positioned to the right of the younger boy? 

[P01132 | 188:189 | NORMAL_TEXT | TABLE row=1 col=1]
⟦EMPTY PARAGRAPH⟧

[P01133 | 189:260 | NORMAL_TEXT | TABLE row=1 col=1]
Was the seated man positioned in front of the woman holding the baby? 

[P01134 | 261:265 | NORMAL_TEXT | TABLE row=1 col=2]
Yes

[P01135 | 265:266 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P01136 | 266:269 | NORMAL_TEXT | TABLE row=1 col=2]
No

[P01137 | 269:270 | NORMAL_TEXT | TABLE row=1 col=2]
⟦EMPTY PARAGRAPH⟧

[P01138 | 272:307 | NORMAL_TEXT | TABLE row=2 col=0]
Absolute image-frame reference (2)

[P01139 | 308:383 | NORMAL_TEXT | TABLE row=2 col=1]
Were the women in white dresses positioned on the left side of the image? 

[P01140 | 383:384 | NORMAL_TEXT | TABLE row=2 col=1]
⟦EMPTY PARAGRAPH⟧

[P01141 | 384:446 | NORMAL_TEXT | TABLE row=2 col=1]
Was the younger boy positioned on the left side of the image?

[P01142 | 447:450 | NORMAL_TEXT | TABLE row=2 col=2]
No

[P01143 | 450:451 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P01144 | 451:452 | NORMAL_TEXT | TABLE row=2 col=2]
⟦EMPTY PARAGRAPH⟧

[P01145 | 452:456 | NORMAL_TEXT | TABLE row=2 col=2]
Yes

[P01146 | 457:458 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

